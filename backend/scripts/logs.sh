#!/usr/bin/env bash
# Usage:
#   ./scripts/logs.sh            # tail last 30 min of all logs
#   ./scripts/logs.sh errors     # last 1h of ERROR lines only
#   ./scripts/logs.sh tail       # live tail (ctrl-c to stop)
#   ./scripts/logs.sh query      # CloudWatch Insights: errors + context
set -euo pipefail

REGION="us-west-2"
LOG_GROUP="/aws/lambda/ovyu-api-production"
NOW_MS=$(( $(date +%s) * 1000 ))
ONE_HOUR_AGO=$(( NOW_MS - 3600000 ))
THIRTY_MIN_AGO=$(( NOW_MS - 1800000 ))

cmd="${1:-recent}"

case "$cmd" in
  errors)
    echo "=== Errors (last 1 hour) ==="
    aws logs filter-log-events \
      --log-group-name "$LOG_GROUP" \
      --region "$REGION" \
      --start-time "$ONE_HOUR_AGO" \
      --filter-pattern '"level":"ERROR"' \
      --query 'events[*].message' \
      --output text \
    | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if not line: continue
    try:
        obj = json.loads(line)
        print(f\"[{obj.get('ts','')}] {obj.get('msg','')}  fn={obj.get('fn','')}\")
        if 'exc' in obj:
            for l in obj['exc']: print('  ', l.rstrip())
    except:
        print(line)
"
    ;;

  tail)
    echo "=== Live tail (Ctrl-C to stop) ==="
    aws logs tail "$LOG_GROUP" --region "$REGION" --follow --format short
    ;;

  query)
    echo "=== CloudWatch Insights: errors last 1h ==="
    QUERY_ID=$(aws logs start-query \
      --log-group-name "$LOG_GROUP" \
      --region "$REGION" \
      --start-time $(( NOW_MS / 1000 - 3600 )) \
      --end-time $(( NOW_MS / 1000 )) \
      --query-string 'fields @timestamp, msg, fn, exc | filter level = "ERROR" | sort @timestamp desc | limit 20' \
      --query 'queryId' --output text)
    echo "Query ID: $QUERY_ID — waiting..."
    until result=$(aws logs get-query-results --query-id "$QUERY_ID" --region "$REGION" --query 'status' --output text 2>/dev/null); [ "$result" = "Complete" ]; do sleep 2; done
    aws logs get-query-results --query-id "$QUERY_ID" --region "$REGION" \
      --query 'results[*][*].value' --output table
    ;;

  recent|*)
    echo "=== Recent logs (last 30 min) ==="
    aws logs filter-log-events \
      --log-group-name "$LOG_GROUP" \
      --region "$REGION" \
      --start-time "$THIRTY_MIN_AGO" \
      --query 'events[*].message' \
      --output text \
    | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if not line or line.startswith('START') or line.startswith('END') or line.startswith('REPORT'): continue
    try:
        obj = json.loads(line)
        level = obj.get('level', 'INFO')
        prefix = '🔴 ' if level == 'ERROR' else ('🟡 ' if level == 'WARNING' else '   ')
        print(f\"{prefix}[{obj.get('ts','')}] {level:7s} {obj.get('msg','')}\")
        if 'exc' in obj:
            for l in obj['exc']: print('       ', l.rstrip())
    except:
        if line: print('  ', line)
"
    ;;
esac
