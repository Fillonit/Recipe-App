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
    noResource: (res) => {
        res.status(500).json({ message: "Could not find the resource." });
    },
    inputsInvalid: (res) => {
        res.status(500).json({ message: "Inputs are invalid." });
    },
    inputsNotProvided: (res) => {
        res.status(500).json({ message: "Inputs are not provided." });
    },
    unexpectedDataType: (res) => {
        res.status(500).json({ message: "Unexpected data type." });
    },
    invalidDataType: (res) => {
        res.status(500).json({ message: "Invalid data type." });
    },
    resourceNotFound: (res) => {
        res.status(500).json({ message: "Resource not found." });
    },
    resourceAdded: (res) => {
        res.status(201).json({ message: "Resource added successfully." });
    },
    resourceUpdated: (res) => {
        res.status(200).json({ message: "Resource updated successfully." });
    },
    resourceFetched: (res, response) => {
        res.status(200).json({ message: "Resource fetched successfully.", response: response });
    }
}