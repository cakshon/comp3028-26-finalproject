
const validateListing = (req, res, next) => {
    const {
        category,
        quantity,
        collectionLocation,
        storageRequirements,
        allergenInformation,
        collectionDeadline
    } = req.body;

    const errors = [];

    // Check required text fields
    const textFields = {
        category,
        collectionLocation,
        storageRequirements,
        allergenInformation
    };

    for (const [field, value] of Object.entries(textFields)) {
        if (typeof value !== 'string' || value.trim() === '') {
            errors.push(`${field} is required`);
        }
    }

    // Quantity must be a positive number
    if (
        typeof quantity !== 'number' ||
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {
        errors.push('Quantity must be greater than zero');
    }

    // Collection deadline must be a valid future date
    if (
        typeof collectionDeadline !== 'string' ||
        !Number.isFinite(Date.parse(collectionDeadline)) ||
        Date.parse(collectionDeadline) <= Date.now()
    ) {
        errors.push('Collection deadline must be a valid future date');
    }

    // Reject the request if validation fails
    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Invalid listing data',
            errors
        });
    }

    // Continue to the next middleware or controller
    next();
};

module.exports = validateListing;
