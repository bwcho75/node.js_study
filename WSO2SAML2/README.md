in WSO2 Identity Server > Identity > Service Providers
It needs to add new Service Provider 
and set "Inbound Authentication Configuration" > "SAML2 Web SSO Configuration"
- Issuer : "passport-saml"
- Assertion Consumer URL : "http://localhost:3000/login/callback"
- NameID format : "urn:oasis:names:tc:SAML:2.0:nameid-format:entity"
