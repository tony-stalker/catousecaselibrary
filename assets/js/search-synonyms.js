/* Cato Use Case Library — search synonyms (index page only; loaded before app.js).
   app.js expands each query token (or multi-word phrase) that appears in a group — as the key
   or as one of its terms — to the whole group, so "vpn replacement" finds ZTNA pages and "sdwan"
   finds "SD-WAN". Keys and terms are lower-case; multi-word terms are matched as phrases.
   Synonym hits score at half the weight of the typed word, so the literal match still ranks first.
   Keep terms specific: a word that appears in most page bodies ("events", "cost", "audit") makes
   every query that expands to it match the whole library. Add a group per product term SEs type
   differently from how the pages spell it. Ships unchanged
   in the prospect edition (assets are copied wholesale by _extract/build-prospect.py). */
window.UC_SYNONYMS = {
  ztna:      ["sdp", "zero trust", "zero-trust", "vpn replacement", "software-defined perimeter", "private access"],
  swg:       ["web filtering", "url filtering", "secure web gateway", "web security", "proxy"],
  dem:       ["experience monitoring", "digital experience", "user experience"],
  casb:      ["shadow it", "saas", "saas security", "cloud access security broker", "app control"],
  dlp:       ["data loss", "data loss prevention", "data protection", "exfiltration", "sensitive data"],
  mpls:      ["private wan", "leased line", "carrier wan", "wan replacement"],
  "sd-wan":  ["sdwan", "software-defined wan", "wan edge", "last mile", "link aggregation"],
  fwaas:     ["firewall", "ngfw", "firewall as a service", "cloud firewall", "firewall refresh"],
  ips:       ["intrusion prevention", "intrusion detection", "ids", "signatures"],
  xdr:       ["detection and response", "soc", "threat hunting"],
  rbi:       ["remote browser isolation", "browser isolation"],
  tls:       ["ssl", "tls inspection", "ssl inspection", "decryption", "https inspection"],
  posture:   ["device posture", "compliance check", "endpoint posture", "health check"],
  identity:  ["sso", "mfa", "idp", "saml", "scim", "entra", "okta", "azure ad", "user awareness"],
  "app-connectors": ["app connector", "application connector", "clientless", "agentless", "connector"],
  genai:     ["generative ai", "chatgpt", "copilot", "llm", "ai apps", "shadow ai", "ai security"],
  "ai-agents": ["agentic", "agentic ai", "mcp", "autonomous agents", "ai agents"],
  compliance: ["iso 27001", "iso27001", "nis2", "dora", "pci", "pci dss", "cyber essentials", "dspt", "gdpr"],
  "ot-iot":  ["ot", "iot", "scada", "industrial", "plc", "operational technology"],
  cloud:     ["aws", "azure", "gcp", "cloud datacenter", "cloud data centre", "vsocket", "cloud on-ramp", "interconnect"],
  ipsec:     ["ikev2", "site-to-site", "vpn tunnel", "third-party device"],
  socket:    ["x1500", "x1600", "x1700", "appliance", "edge device", "branch device"],
  byod:      ["unmanaged device", "personal device", "contractor laptop", "browser extension", "enterprise browser"],
  "third-party": ["3rd party", "3rd-party", "contractor", "supplier", "partner access", "supply chain", "vendor access"],
  remote:    ["remote worker", "work from home", "wfh", "hybrid work", "hybrid workforce", "road warrior", "always-on"],
  migration: ["cutover", "coexistence", "co-existence", "phased", "rip and replace", "parallel run"],
  ransomware: ["malware", "anti-malware", "threat prevention", "c2", "command and control", "phishing"],
  qos:       ["bandwidth", "prioritisation", "prioritization", "voice quality", "teams calls", "zoom"],
  api:       ["graphql", "terraform", "automation", "infrastructure as code", "iac", "event feed"],
  "data-lake": ["event logs", "siem", "splunk", "sentinel", "log export"],
  "m&a":     ["m&a", "merger", "acquisition", "mergers and acquisitions", "divestiture"],
  pov:       ["proof of value", "proof of concept", "poc", "pilot", "evaluation", "success criteria"],
  tco:       ["total cost of ownership", "consolidation", "vendor consolidation", "business case", "roi"],
  zscaler:   ["zia", "zpa", "zdx"],
  "palo-alto": ["palo alto", "prisma", "prisma access", "panorama", "pan-os", "globalprotect"],
  fortinet:  ["fortigate", "fortisase", "fortios"],
  cisco:     ["asa", "firepower", "meraki", "umbrella", "viptela", "anyconnect"],
  netskope:  ["netskope one"],
  checkpoint: ["check point", "harmony", "quantum"],
  sonicwall: ["sonic wall"]
};
