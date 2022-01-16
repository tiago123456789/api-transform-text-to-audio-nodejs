module.exports = (error, request, response, next)  => {

    switch (error.name) {
        case "InvalidDataException":
            return response.status(400).json({ message: error.message });
        default: 
            console.log(error.message)
            return response.status(500).json({ message: "Internal server error" });
    }
}