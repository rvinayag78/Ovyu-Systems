# CI/CD Pipeline — Ovyu

## Branch Model

```
feature/* → PR → staging → main (prod)
```

- `staging` branch → auto-deploys to **Staging** on every push
- `main` branch → auto-deploys to **Production** after manual approval gate
- Promotion = PR from `staging` → `main`

---

## Environment Separation

| Resource | Staging | Production |
|---|---|---|
| Amplify branch | `staging` | `main` |
| Lambda function | `ovyu-api-staging` | `ovyu-api-production` |
| RDS database | same cluster, DB `ovyu_staging` | same cluster, DB `ovyu` |
| Cognito pool | `ovyu-staging` | `ovyu-production` |
| API Gateway | staging stage | prod stage |
| `NEXT_PUBLIC_BACKEND_URL` | staging API Gateway URL | prod API Gateway URL |

Terraform workspace: `terraform workspace new staging` duplicates all resources with a `staging` prefix.

---

## Pipeline Tool: GitHub Actions + AWS OIDC

```
.github/
  workflows/
    ci.yml              # every PR: lint, typecheck, tests
    deploy-staging.yml  # push to staging branch
    deploy-prod.yml     # push to main (with approval gate)
```

No long-lived AWS keys. Connect via **OIDC IAM role** — GitHub assumes it per-job.

---

## `ci.yml` — Every PR

```yaml
on: [pull_request]
jobs:
  frontend:
    - npm ci
    - npx tsc --noEmit
    - npm run build
  backend:
    - pip install -r requirements.txt
    - pytest backend/tests/
```

Blocks merge if any step fails.

---

## `deploy-staging.yml` — Push to `staging`

```
1. Run CI checks
2. Backend:
   a. docker build + push to ECR (tagged :staging and :sha-<git-sha>)
   b. aws lambda update-function-code --function ovyu-api-staging
   c. alembic upgrade head (against staging DB)
3. Frontend:
   a. Amplify auto-deploys from the staging branch (already configured)
   b. Wait for Amplify job to complete
4. Smoke test: curl staging /api/v1/health
```

---

## `deploy-prod.yml` — Push to `main`

```
1. Manual approval gate (GitHub Environment "production" → required reviewers)
2. Backend:
   a. docker build + push to ECR (tagged :latest and :sha-<git-sha>)
   b. aws lambda update-function-code --function ovyu-api-production
   c. alembic upgrade head (against prod DB)
3. Frontend:
   a. Amplify auto-deploys from main
   b. Wait for Amplify job to complete
4. Health check: curl prod /api/v1/health
5. Notify on success/failure (email or Slack)
```

---

## Migration Safety

Deploy order to avoid downtime:

```
1. Deploy new Lambda (backward-compatible — old schema still works)
2. Run alembic upgrade head  ← new schema live
3. On failure: aws lambda update-function-code --image-uri <prev-sha-tag>
```

Tag every ECR push with the git SHA so any commit is instantly rollbackable.

---

## AWS OIDC Setup (one-time)

```hcl
# In Terraform — creates the role GitHub Actions assumes
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

resource "aws_iam_role" "github_actions" {
  name = "ovyu-github-actions"
  assume_role_policy = jsonencode({
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = aws_iam_openid_connect_provider.github.arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = { StringLike = {
        "token.actions.githubusercontent.com:sub" = "repo:rvinayag78/Ovyu-Systems:*"
      }}
    }]
  })
}
# Attach: ECR push, Lambda update, RDS tunnel (via SSM or bastion)
```

---

## Implementation Order

1. **Terraform staging workspace** — duplicate infra, get staging Lambda + DB
2. **AWS OIDC IAM role** — no stored keys in GitHub secrets
3. **`ci.yml`** — lint + test on every PR (1 hour, immediate value)
4. **`deploy-staging.yml`** — auto-deploy staging on merge
5. **`deploy-prod.yml`** + approval gate — gated production deploys

---

## Key Files to Create

```
.github/workflows/ci.yml
.github/workflows/deploy-staging.yml
.github/workflows/deploy-prod.yml
infrastructure/modules/oidc-github/main.tf   ← OIDC role
backend/deploy.sh → backend/deploy.sh <env>  ← parameterize for staging/prod
```
