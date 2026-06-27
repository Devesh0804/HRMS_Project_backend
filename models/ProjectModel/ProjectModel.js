import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    projectCode: {
        type: String,
        required: true,
        unique: true
    },
    clientName: {
        type: String,
        required: true
    },
    projectManager: {
        type: String,
        required: true
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    priority: {
        type: String
    },
    status: {
        type: String,
        default: 'Planning'
    },
    budget: {
        type: String
    },
    teamSize: {
        type: String
    },
    description: {
        type: String
    }
  
},{timestamps:true})



const ProjectModel = mongoose.model('project',projectSchema);


export default ProjectModel;
