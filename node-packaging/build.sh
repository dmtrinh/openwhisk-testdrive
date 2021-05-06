#!/bin/sh

npm install
zip -r encryptAction.zip *
wsk -i action delete encryptAction 
wsk -i action create encryptAction --kind nodejs:14 encryptAction.zip

echo "To invoke this action via OpenWhisk: "
echo "  $ wsk -i action invoke --result encryptAction --param body <some input>"
echo ""
echo "To play around without OpenWhisk: "
echo "  $ node -e 'require(\"./index\").main(\"<some input>\")'"
echo "  $ node -e 'require(\"./index\").decrypt(\"<cipherText output>\")'"
