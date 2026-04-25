FROM public.ecr.aws/lambda/python:3.12
COPY requirements-lambda.txt .
RUN pip install --no-cache-dir -r requirements-lambda.txt
COPY app/ ${LAMBDA_TASK_ROOT}/app/
CMD ["app.main.handler"]
