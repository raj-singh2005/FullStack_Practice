const Complaint = require('../models/Complaint.model');

// Create a new complaint (User or Guest)
const createComplaint = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : req.body.image;
        
        let parsedLocation = req.body.location;
        if (typeof parsedLocation === 'string') {
            parsedLocation = JSON.parse(parsedLocation);
        }

        const userId = (req.body.user === "null" || req.body.user === "undefined" || !req.body.user) 
            ? null 
            : req.body.user;

        const newComplaint = new Complaint({
            title: req.body.title,
            description: req.body.description,
            image: imageUrl,
            location: {
                lat: parsedLocation.lat,
                lng: parsedLocation.lng,
                address: parsedLocation.address || "Jamshedpur"
            },
            status: req.body.status || 'Pending',
            userType: userId ? 'User' : 'Guest',
            user: userId
        });

        await newComplaint.save();
        res.status(201).send({ message: "Complaint saved successfully!", data: newComplaint });

    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).send({ message: "Error sending complaint", error: err.message });
    }
};

// ✨ NEW: Authority Resolves Complaint with Image
const resolveComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        // The resolved image comes from Multer/Cloudinary
        const resolvedImageUrl = req.file ? req.file.path : null;

        if (!resolvedImageUrl) {
            return res.status(400).json({ message: "Proof of resolution image is required" });
        }

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { 
                status: 'Resolved', 
                resolvedImage: resolvedImageUrl,
                resolvedAt: Date.now() 
            },
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.json({ message: "Issue marked as Resolved!", data: updatedComplaint });
    } catch (err) {
        res.status(500).json({ message: "Resolution failed", error: err.message });
    }
};

// Get all complaints
const getComplaints = async (req, res) => {
  try {
    const allComplaints = await Complaint.find()
        .populate('user', 'username stars')
        .sort({ createdAt: -1 }); // Newest first
    res.send(allComplaints);
  } catch (err) {
    res.status(500).send({ message: "Error fetching complaints", error: err });
  }
};

// Get single complaint
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id).populate('user', 'username stars');

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.send(complaint);
  } catch (err) {
    res.status(500).send({ message: "Error fetching the complaint", error: err });
  }
};

// Update Status (Generic: e.g., to 'In Progress')
const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id, 
            { status: status }, 
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.json({ message: "Status updated!", data: updatedComplaint });
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
};

module.exports = {
    createComplaint,
    resolveComplaint, // Don't forget to export this!
    getComplaints,
    getComplaintById,
    updateComplaintStatus
};