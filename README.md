## Octopus Deploy

This action creates an Octopus Release given a DotNet Framework solution.

# Usage
```

- uses: actions/checkout@v1
- uses: nuget/setup-nuget@v1.0.2
- uses: forsythes-technology/action-octopus-deploy-dotnet@master
      with: 
	  	CREATE_RELEASE: true # If set to 'true' the package will be deployed to octopus and a release will be created.
        SOLUTION_FILE: example.sln 
        OCTOPUS_URL: ${{secrets.OCTOPUS_URL}} # Optional
        OCTOPUS_APIKEY: ${{secrets.OCTOPUS_APIKEY}} # Optional
		DEPLOY_TO: Staging # Optional, if included the release will be deployed to this environment automatically
        PROJECT: Example-Project # Optional, if omitted repo name is used instead
        MS_TEAMS_WEBHOOK: <webhook_url> # Optional
```