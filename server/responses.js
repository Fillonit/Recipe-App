let responses = {
    tokenInvalid: (res) => {
        res.status(401).json({ message: "Token is invalid" });
    },
    tokenExpired: (res) => {
        res.status(401).json({ message: "Token is expired" });
    },
    tokenNoPermission: (res) => {
        res.status(403).json({ message: "You do not have permission to access this resource." });
    },
    inputsInvalid: (res) => {
        res.status(422).json({ message: "Inputs are invalid." });
    },
    inputsNotProvided: (res) => {
        res.status(422).json({ message: "Inputs are not provided." });
    },
    unexpectedDataType: (res) => {
        res.status(422).json({ message: "Unexpected data type." });
    },
    invalidDataType: (res) => {
        res.status(422).json({ message: "Invalid data type." });
    },
    resourceNotFound: (res, str) => {
        res.status(404).json({ message: `Resource '${str}' not found.` });
    },
    resourceAdded: (res, str) => {
        res.status(201).json({ message: `Resource '${str}' added successfully.` });
    },
    resourceUpdated: (res, str) => {
        res.status(204).json({ message: `Resource '${str}' updated successfully.` });
    },
    resourceFetched: (res, response) => {
        res.status(200).json({ message: "Resource fetched successfully.", response: response });
    },
    resourceDeleted: (res) => {
        res.status(204).json({ message: "Resource deleted successfully." });
    },
    resourceAlreadyExists: (res, str) => {
        res.status(409).json({ message: `Resource '${str}' already exists.` });
    },
    serverError: (res) => {
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = responses;