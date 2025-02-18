
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asynchandelar.js';
import { ApiError } from '../utils/APIError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';




const registerUser = asyncHandler(async (req, res) => {
    const requiredFields = ["username", "fullName", "email", "password"];

    // Utility function for validating request body

    const validateRequestBody = (body, requiredFields) => {
        return requiredFields.every(field => typeof body[field] === 'string' && body[field].trim() !== '');
    };
    // Validate request body
    if (!validateRequestBody(req.body, requiredFields)) {
        throw new ApiError(400, "All fields are required");
    }

    const { username, fullName, email, password } = req.body;

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Check if files are uploaded
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Upload the avatar and cover image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new ApiError(400, "Avatar file upload failed");
    }

    // Create the user
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Fetch the created user without password and refreshToken
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
