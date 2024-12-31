# Flagd-Hub

## Overview

**Flagd-Hub** is a web-based application designed to provide an interface for managing feature flags for [flagd](https://github.com/open-feature/flagd)
This tool allows users to view, add, update, and delete feature flags in a user-friendly manner. 
It aims to simplify feature flag management for developers, product managers, and teams.

## Key Features
- **View All Flags**: Display a list of all active feature flags with their current configurations.
- **Create Flags**: Add new feature flags with customizable options (boolean, string, or numeric values).
- **Edit Flags**: Update existing feature flag configurations directly from the interface.
- **Delete Flags**: Remove feature flags that are no longer needed.
- **Integration with flagd**: provides flags configuration for flagd to feed from

## Requirements

To use this project, you'll need:

- A running instance of [flagd](https://github.com/open-feature/flagd).
- Node.js (v16 or higher).
- JDK 17
- gradle
- A modern web browser.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/feature-flags-manager.git
   cd feature-flags-manager
   ```

2 Start the application:
   ```bash
   cd feature-flags-ui
   npm start
   ```
   The application will be available at `http://localhost:5002`.

## Technologies Used

- **Frontend**: React, JavaScript, CSS.
- **Backend**: SpringBoot framework
- **Integration**: [flagd](https://github.com/open-feature/flagd).

## Contributing

Contributions are welcome!

## Acknowledgments

- [OpenFeature](https://openfeature.dev) for the flagd project.
- Community contributors for inspiration and feedback
