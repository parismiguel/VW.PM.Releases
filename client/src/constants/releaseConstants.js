export const productOptions = ["Uprise", "Ordering Platform", "Support Tools"];

export const releaseTypeOptions = ["Scheduled Release", "Hotfix", "Beta Release"];

export const statusOptions = ["Planned", "In Progress", "Completed"];

export const systemsImpacted = {
  Uprise: [
    "Uprise Internal Admin Tool",
    "Uprise EHR",
    "Uprise PM",
    "Uprise Database(s)",
    "Uprise External API",
    "Uprise NSB [N-Service Bus]",
    "Uprise Server Updates/Patches (Ex. .Net FW)",
    "Uprise Device Connect",
    "Uprise Patient Portal",
    "Uprise Mirth",
    "Uprise Kapow",
    "Traffic Routing (envoy)",
  ],
  "Ordering Platform": [
    "Ordering Platform Updates/Patches",
    "CST [Customer Service Tool]",
    "Backoffice",
    ".com",
    "Ordering Platform Database(s)",
    "Bengal Databases",
    "WebSphere",
    "RouteONE",
    "Java Applications",
    "Bengal Services",
    "ONEWebServices",
    "WebServices",
    "Tasks [Console Applications]",
  ],
  Shared: [
    "Internal API (Ex. BB APIs, Pricing API)",
    "External APIs",
    "Ordering Platform Webservices",
    "Identity Server",
    "Catalog Loaders",
  ],
};

export const targetServers = {
  staging: {
    Uprise: [
      "UPRSTGAPP1-2",
      "UPRSTGPTNT",
      "UPRSTGSVC",
      "UPRSTGNSB1",
      "UPRSTAGEDB",
      "STAGETASK01",
      "UPRSTGMIRTH",
      "EHRSTGAPP1-2",
      "EHRSTGDB",
    ],
    "Ordering Platform": [
      "STAGEAPP2012 – Ordering Platform",
      "PRODSTAGE01 – Ordering Platform",
    ],
    Shared: ["PRODKUBRH01-06", "STGMONGODB"],
  },
  production: {
    Uprise: [
      "UPRAPP 1-10",
      "UPRPATIENT01-02",
      "UPRSERVICE 1-3 (1-2 Uprise, 3 Eagle)",
      "UPRNSB",
      "UPRDB",
      "UPRTASK01",
      "UPRMIRTH01",
      "EHRAPP01-06",
      "EHRDB",
      "G1 APP Servers",
      "UPRP2APP1-10",
      "UPRP2NSB",
      "UPRP2DB",
      "EHRP2APP1-4",
      "EHRP2DB",
      "EHRUPRAPP1-4",
      "PRODKAPOW",
      "UPRP1FPCAPP1-5",
      "UPRP2SQLREP",
      "UPRSCAN1-2",
    ],
    "Ordering Platform": [
      "PRODAPP1 through 10",
      "VWPRDDB",
      "VWPRDEMDB",
      "PRODSERVICES1 through 6",
      "PRODTASK",
      "PRODTASK1",
      "PRODR1",
      "PRODWAS851 through 853",
      "PRODSFTP",
      "PRODRABBIT",
      "PRODMQ7",
      "PRODMONGORS0-1-2-3",
    ],
    Shared: [
      "PRODKUBRH01-06",
      "PRODMONGODB01  (migration)",
      "PRODMONGO2  (identity)",
      "PRODMONGODB  (remittance)",
    ],
  },
};

export const preRequisites = { 
    data: [
    {
      criteria: "Code Complete",
      status: false,
      exceptions: "",
    },
    {
      criteria: "Merge Completed & Approved",
      status: false,
      exceptions: "",
    },
    {
      criteria:
        "Uprise version updated in TFS release (version number within the Uprise “About” UI)",
      status: false,
      exceptions: "",
    },
    {
      criteria:
        "[Link to Release Definition](https://tickets.visionweb.com/tfs/VisionWeb/Infrastructure/_apps/hub/ms.vss-releaseManagement-web.cd-workflow-hub?definitionId=20&_a=definition-variables)",
      status: false,
      exceptions: "",
    },
    {
      criteria: "Product Backlog Item Accepted by Product Mgmt.",
      status: false,
      exceptions: "",
    },
    {
      criteria: "Functional Test Completed",
      status: false,
      exceptions: "",
    },
    {
      criteria: "In-sprint Regression/Integration Test Completed",
      status: false,
      exceptions: "",
    },
    {
      criteria:
        "Configuration Changes Updated (Ex. Connection Strings, URLs, Services, Etc.)",
      status: false,
      exceptions: "",
    },
    {
      criteria: "Unit Test Completed",
      status: false,
      exceptions: "",
    },
    {
      criteria: "All applicable Db. scripts approved & ran",
      status: false,
      exceptions: "",
    },
    {
      criteria: "Test strategy reviewed and approved",
      status: false,
      exceptions: "",
    },
  ]};