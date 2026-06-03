# Contributing to grafana-pcp

Thank you for your interest in contributing to the Performance Co-Pilot Grafana Plugin.

## Reporting Issues

Please report bugs and feature requests on the [GitHub issue tracker](https://github.com/performancecopilot/grafana-pcp/issues).

## Development Setup

1. Clone the repository
2. Install dependencies: `make deps`
3. Build the plugin: `make build`
4. Start Grafana with the plugin: `podman compose up` (or `docker compose up`)
5. Access Grafana at `http://localhost:3000`

Grafana will load the plugin from `dist/` and apply the provisioning files. To use the datasources, you'll also need PCP and Valkey running (e.g., via `make test-ui-start-pod`).

Use `make watch-frontend` to auto-rebuild on file changes during development. See the [Makefile](Makefile) for all available commands.

## Running Tests

```bash
make test-frontend          # Frontend unit tests
make test-backend           # Backend unit tests
make test-ui                # End-to-end Playwright tests
```

## Submitting Changes

1. Fork the repository and create a branch from `main`
2. Make your changes and ensure all tests pass
3. Submit a pull request with a clear description of the changes
