import * as core from "@actions/core";
import { exec } from "@actions/exec";
import * as github from "@actions/github";

async function main() {
	try {

		const createReleaseInput: string = core.getInput("CREATE_RELEASE", { required: true });
		const octopusUrl: string = core.getInput("OCTOPUS_URL", { required: false });
		const octopusApiKey: string = core.getInput("OCTOPUS_APIKEY", { required: false });
		const solutionFile = core.getInput("SOLUTION_FILE", { required: false });
		const project: string = core.getInput("PROJECT", { required: false });
		const deployTo: string = core.getInput("DEPLOY_TO", { required: false });
		const msTeamsWebhook: string = core.getInput("MS_TEAMS_WEBHOOK", { required: false });
		const context = github.context;
		const repo = context.repo.repo;
		const projectName = project ? project : repo;
		const createRelease = (createReleaseInput.toLowerCase() === "true");
		if (createRelease && (!octopusUrl || !octopusApiKey)) {
			throw new Error("Cannot create a release without OCTOPUS_URL and OCTOPUS_APIKEY being defined");
		}

		if (context.ref.indexOf("refs/tags/") === -1) {
			throw new Error("Unable to get a version number");
		}
		const version = context.ref.replace("refs/tags/", "");
		core.info(`🐙 Deploying project ${projectName} (Version ${version}) to Octopus `);
		core.info(`Building solution (ref: ${context.ref})...`);
		core.info("NuGet Restore...");
		await exec(`nuget restore`);
		core.info("Building...");
		if (createRelease) { // Build, pack and release
			await exec(`"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Enterprise\\MSBuild\\Current\\Bin\\MSBuild.exe" ${solutionFile} /p:Configuration=Release /p:RunOctoPack=true  /p:OctoPackPackageVersion=${version} /p:OctoPackPublishPackageToHttp=${octopusUrl}/nuget/packages /p:OctoPackPublishApiKey=${octopusApiKey}`);
			core.info("Installing octopus cli...");
			await exec(`dotnet tool install octopus.dotnet.cli --tool-path .`);
			core.info("Creating Release...");
			const deployToString = deployTo ? `--deployTo=${deployTo}` : "";
			await exec(`.\\dotnet-octo create-release --project=${projectName} --version=${version} --server=${octopusUrl} --apiKey=${octopusApiKey} ${deployToString}`);
			if (msTeamsWebhook) {
				sendTeamsNotification(projectName, `✔ Version ${version} Deployed to Octopus`, msTeamsWebhook);
			}
		} else { // Otherwise, just build
			await exec(`"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Enterprise\\MSBuild\\Current\\Bin\\MSBuild.exe" ${solutionFile}`);

		}
		core.info("✅ complete");
	} catch (err) {
		core.error("❌ Failed");
		core.setFailed(err.message);
	}
}

/**
 * Sends a MS Teams notification
 * @param title
 * @param body
 * @param webhookUrl
 */
async function sendTeamsNotification(title: string, body: string, webhookUrl: string) {
	const data = `"{ '@context': 'http://schema.org/extensions', '@type': 'MessageCard', 'title': '${title}', 'text': '${body}' }"`;
	core.info("Sending Teams notification...");
	await exec(`curl --url "${webhookUrl}" -d ${data}`);
}

main();
