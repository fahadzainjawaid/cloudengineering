
import {$, fs, YAML, spinner} from "zx";
import ObjectsToCsv from "objects-to-csv";

$.verbose = false;

const orgID = "1022453717088"; //cloudshift
const scope = "organizations/$(orgID)";

const projects = await getProjects();
await writeToCsv(projects, "tmp/gcp-projects.csv");


export async function getProjects() {

    let p = [];
    const result = await spinner (
        "Getting cloud projects...",
        () => $`gcloud projects list --format=json`
    );

    var data =  YAML.parseAllDocuments(result.stdout);
    data = data.map((item)=> item.toJS());

    data.forEach ((indx) => {
        indx.forEach ((doc) => {
            let item = {};
            console.log(doc);
            item.projectName = doc.name;
            item.projectNumber = doc.projectNumber;
            item.projectId = doc.projectId;      
            item.organizationId = doc.parent.id;
            item.state = doc.lifecycleState;
            p.push(item);
        });
    });

    return p;
}


export async function writeToCsv(data, destFilePath) {
    const csv = new ObjectsToCsv(data);

    await ("Writing CSV...", csv.toDisk(destFilePath));
}