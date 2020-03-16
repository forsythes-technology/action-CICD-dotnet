## Octopus Deploy

This action creates an Octopus Release given a DotNet Framework solution.

# Usage
```

- uses: actions/checkout@v1
- uses: nuget/setup-nuget@v1.0.2
- uses: forsythes-technology/action-octopus-deploy-dotnet@master
      with: 
	  	CREATE_RELEASE: true # If set to 'true' the package will be deployed to octopus and a release will be created.
        OCTOPUS_URL: ${{secrets.OCTOPUS_URL}} # Optional
        OCTOPUS_APIKEY: ${{secrets.OCTOPUS_APIKEY}} # Optional
        SOLUTION_FILE: example.sln 
		ENFORCE_ADDING_FILES: true # Optional, If set to true OctoPackEnforceAddingFiles flag will be added to build command
		DEPLOY_TO: Staging # Optional, if included the release will be deployed to this environment automatically
        PROJECT: Example-Project # Optional, if omitted repo name is used instead
		CONFIGURATION: Release # Optional, If set a configuration flag will be added to the build command defaults to Release.
		MS_TEAMS_WEBHOOK: <url>  # Optional, If set a MS Teams notification will be sent to this webhook
```