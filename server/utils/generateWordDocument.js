const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ExternalHyperlink,
} = require("docx");
const axios = require("axios");
const sharp = require("sharp");

// Helper function to fetch image buffer from URL
const validateAndProcessImage = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    const contentType = response.headers["content-type"];
    if (!contentType.startsWith("image/")) {
      throw new Error(
        `URL ${url} does not point to an image. Content-Type: ${contentType}`
      );
    }

    const signature = buffer.slice(0, 8).toString("hex");
    if (signature.startsWith("89504e47")) {
      // PNG
      console.log("Confirmed PNG image.");
    } else if (signature.startsWith("ffd8ff")) {
      // JPEG
      console.log("Confirmed JPEG image.");
    } else {
      console.warn("Unknown image format detected:", signature);
    }

    // Validate the image
    const metadata = await sharp(buffer).metadata();
    console.log("Image Metadata:", metadata);

    // Resize and compress the image
    const processedBuffer = await sharp(buffer)
      .resize({ width: 500 }) // Resize to a max width of 500px
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer();

    return processedBuffer;
  } catch (error) {
    console.error(`Failed to validate or process image from ${url}:`, error);
    throw new Error(`Could not process image: ${error.message}`);
  }
};

const sanitizeCellData = (cell) => (cell ? cell : "N/A");

const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
};

// Helper function to create tables for array sections
const createTable = (
  title,
  headers,
  data,
  content,
  hyperlinkColumnIndex = -1
) => {
  if (data && data.length > 0) {
    content.push(
      new Paragraph({
        text: title,
        heading: "Heading1",
      })
    );
    content.push(
      new Table({
        rows: [
          new TableRow({
            children: headers.map(
              (header) =>
                new TableCell({
                  children: [new Paragraph(header)],
                  width: { size: 2000, type: WidthType.DXA },
                  shading: { fill: "D9D9D9" },
                })
            ),
          }),
          ...data.map(
            (item) =>
              new TableRow({
                children: item.map((cell, index) => {
                  const sanitizedCell = sanitizeCellData(cell);
                  if (index === hyperlinkColumnIndex && sanitizedCell) {
                    return new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new ExternalHyperlink({
                              children: [
                                new TextRun({
                                  text: sanitizedCell,
                                  style: "Hyperlink",
                                }),
                              ],
                              link: sanitizedCell,
                            }),
                          ],
                        }),
                      ],
                    });
                  }
                  return new TableCell({
                    children: [new Paragraph(sanitizedCell)],
                  });
                }),
              })
          ),
        ],
        borders: tableBorders,
        width: {
          size: 100
        },
      })
    );
  }
};

// Add Environment (Staging and Production) Sections
const addEnvironmentContent = (envName, envData, content) => {
  if (envData) {
    content.push(
      new Paragraph({
        text: `${envName} Environment`,
        heading: "Heading1",
      }),
      new Paragraph({
        text: `Deployment Date: ${envData.deployment_date || "N/A"}`,
      }),
      new Paragraph({
        text: `Deployment Time: ${envData.deployment_time || "N/A"}`,
      }),
      new Paragraph({
        text: `Deployment Duration: ${
          envData.deployment_duration || "N/A"
        } hours`,
      }),
      new Paragraph({
        text: `Downtime: ${envData.downtime || "N/A"} hours`,
      }),
      new Paragraph({
        text: `Informed Resources: ${
          envData.informed_resources ? "Yes" : "No"
        }`,
      }),
      new Paragraph({
        text: `Systems Impacted: ${
          envData.systems_impacted?.join(", ") || "N/A"
        }`,
      }),
      new Paragraph({
        text: `Target Servers: ${envData.target_servers?.join(", ") || "N/A"}`,
      }),
      new Paragraph({
        text: `Resources Responsible: ${
          envData.resources_responsible?.join(", ") || "N/A"
        }`,
      })
    );
  }
};

// Function to generate a Word document
const generateWordDocument = async (release) => {
  let content = [
    new Paragraph({
      text: `${release.product_name} - ${release.release_version}`,
      heading: "Title",
      bold: true,
    }),
    new Paragraph({ text: "", spacing: { after: 240 } }),
    new Paragraph({
      text: `Release Type: ${release.release_type || "N/A"}`,
    }),
    new Paragraph({ text: `Status: ${release.status || "N/A"}` }),
    new Paragraph({ text: "JIRA Release Filter:" }),
    new Paragraph({
      children: [
        new TextRun({
          text: release.jira_release_filter || "N/A",
          style: "Hyperlink",
          hyperlink: release.jira_release_filter || undefined,
        }),
      ],
    }),
    new Paragraph({
      text: `Created At: ${new Date(release.createdAt).toLocaleString()}`,
    }),
    new Paragraph({ text: `Created By: ${release.createdBy || "N/A"}` }),
    new Paragraph({
      text: `Modified At: ${new Date(release.modifiedAt).toLocaleString()}`,
    }),
    new Paragraph({
      text: `Modified By: ${release.modifiedBy || "N/A"}`,
    }),
  ];

  content.push(new Paragraph({ text: "", spacing: { after: 240 } }));

  addEnvironmentContent("Staging", release.staging, content);
  content.push(new Paragraph({ text: "", spacing: { after: 240 } }));

  addEnvironmentContent("Production", release.production, content);
  content.push(new Paragraph({ text: "", spacing: { after: 240 } }));

  // Add Prerequisites Table
  createTable(
    "Prerequisites",
    ["Criteria", "Status", "Exceptions"],
    release.prerequisiteData?.map((prereq) => [
      prereq.criteria,
      prereq.status ? "Met" : "Not Met",
      prereq.exceptions,
    ]),
    content
  );
  content.push(new Paragraph({ text: "", spacing: { after: 240 } }));

  // Add Readiness Table
  createTable(
    "Readiness",
    ["Criteria", "Status", "Exceptions"],
    release.readinessData?.map((readiness) => [
      readiness.criteria,
      readiness.status ? "Ready" : "Not Ready",
      readiness.exceptions,
    ]),
    content
  );
  content.push(new Paragraph({ text: "", spacing: { after: 240 } }));

  // Add Pre-Deployment Tasks Table
  createTable(
    "Pre-Deployment Tasks",
    ["Description", "Owner", "Staging Complete", "Prod Complete"],
    release.preDeploymentTasks?.map((task) => [
      task.description,
      task.owner,
      task.stagingComplete ? "Yes" : "No",
      task.prodComplete ? "Yes" : "No",
    ]),
    content
  );
  content.push(new Paragraph({ text: "", spacing: { after: 240 } }));

  // Add Risks Table
  createTable(
    "Risks",
    ["Risk", "Remediation"],
    release.risks?.map((risk) => [risk.risk, risk.remediation]),
    content
  );
  content.push(new Paragraph({ text: "", spacing: { after: 240 } }));

  // Add Validation Tasks Table with clickable Release Link
  createTable(
    "Validation Tasks",
    [
      "Repository Name",
      "Release Link",
      "Resource",
      "Begin/End Time",
      "Staging Comments",
      "Prod Comments",
    ],
    release.validationTasks?.map((task) => [
      task.repositoryName,
      task.releaseLink,
      task.resource,
      task.beginEndTime,
      task.stagingComments,
      task.prodComments,
    ]),
    content,
    1 // Index of the "Release Link" column
  );
  content.push(new Paragraph({ text: "", spacing: { after: 240 } }));

  // Add Post-Deployment Tasks Table
  createTable(
    "Post-Deployment Tasks",
    ["Task", "Resource", "Begin/End Time", "Staging Comments", "Prod Comments"],
    release.postDeploymentTasks?.map((task) => [
      task.task,
      task.resource,
      task.beginEndTime,
      task.stagingComments,
      task.prodComments,
    ]),
    content
  );
  content.push(new Paragraph({ text: "", spacing: { after: 240 } }));

  // Add Post-Deployment Issues Table
  createTable(
    "Post-Deployment Issues",
    ["ID", "Title", "SF Solution", "Work Item Type", "TFS Release", "Comments"],
    release.postDeploymentIssues?.map((issue) => [
      issue.id,
      issue.title,
      issue.sfSolution,
      issue.workItemType,
      issue.tfsRelease,
      issue.comments,
    ]),
    content
  );
  content.push(new Paragraph({ text: "", spacing: { after: 240 } }));

  // Add Known Issues Table
  createTable(
    "Known Issues",
    ["JIRA Item", "SF Solution", "Proposed Release", "Comments"],
    release.knownIssues?.map((issue) => [
      issue.jiraItem,
      issue.sfSolution,
      issue.proposedRelease,
      issue.comments,
    ]),
    content
  );
  content.push(new Paragraph({ text: "", spacing: { after: 240 } }));

  // Generate the screenshots content
  let screenshotsContent = [];
  if (release.screenshots && release.screenshots.length > 0) {
    screenshotsContent = await Promise.all(
      release.screenshots.map(async (screenshot, index) => {
        try {
          const imageBuffer = await validateAndProcessImage(screenshot.url);

          // Skip large images
          if (imageBuffer.length > 1 * 1024 * 1024) {
            console.warn(
              `Image ${screenshot.url} is too large and will be skipped.`
            );
            return new Paragraph({
              text: `Image ${index + 1} is too large to include.`,
              alignment: "center",
            });
          }

          const dimensions = { width: 500, height: Math.round((500 * 3) / 4) }; // Maintain aspect ratio

          return new Paragraph({
            alignment: "center",
            children: [
              //This is causing layout issues
              // new ImageRun({
              //   data: imageBuffer,
              //   transformation: dimensions,
              // }),
              new TextRun({
                text: `Screenshot ${index + 1}`,
                break: 1,
              }),
            ],
          });
        } catch (error) {
          console.error(
            `Failed to fetch or add image: ${screenshot.url}`,
            error
          );
          return new Paragraph({
            text: `Failed to load screenshot ${index + 1}`,
            alignment: "center",
          });
        }
      })
    );

    // Add a heading for the screenshots section
    screenshotsContent.unshift(
      new Paragraph({
        text: "Screenshots",
        heading: "Heading1",
      })
    );
  }

  // Now create a single section with the combined content array
  const doc = new Document({
    creator: "VW.PM.Releases",
    title: `${release.product_name} - ${release.release_version}`,
    description: "Generated Word document for release details",
    styles: {
      default: {
        document: {
          run: {
            font: "Aptos",
            size: 20, // 10pt font size (in half-points)
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
          continuous: true,
        },
        children: content,
      },
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
          continuous: true,
        },
        children: screenshotsContent,
      },
    ],
  });

  // Generate the document buffer
  const buffer = await Packer.toBuffer(doc);
  return buffer;
};

module.exports = generateWordDocument;
