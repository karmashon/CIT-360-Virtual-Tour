const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	est: {
		type: Number,
		required: false
	},
	imgDirection: {
		type: String,
		required: true,
	},
	dateOfImage: {
		type: Date,
		required: true,
		default: Date.now
	},
	description: {
		type: Object,
		properties: {
			departmentOrCentreOrLandmark: {
				type: String,
				required: true
			},
			about: {
				type: String,
				required: true,
				default: "None"
			},
			directorOrHead: {
				type: String,
				required: true,
				default: "None"
			},
			websiteLink: {
				type: String,
				required: true,
				default: "404"
			},
			audioLink: {
				type: String,
				required: true,
				default: "404"
			},
			nearByBuildings: {
				type: Object,
				properties: {
					building1: {
						type: Object,
						properties: {
							name: {
								type: String,
								required: true,
								default: "None"
							},
							position: {
								type: String,
								required: true,
								default: "0 0 0"
							}
						}
					},
					building2: {
						type: Object,
						properties: {
							name: {
								type: String,
								required: true,
								default: "None"
							},
							position: {
								type: String,
								required: true,
								default: "0 0 0"
							}
						}
					},
					building3: {
						type: Object,
						properties: {
							name: {
								type: String,
								required: true,
								default: "None"
							},
							position: {
								type: String,
								required: true,
								default: "0 0 0"
							}
						}
					},
					building4: {
						type: Object,
						properties: {
							name: {
								type: String,
								required: true,
								default: "None"
							},
							position: {
								type: String,
								required: true,
								default: "0 0 0"
							}
						}
					},
					building5: {
						type: Object,
						properties: {
							name: {
								type: String,
								required: true,
								default: "None"
							},
							position: {
								type: String,
								required: true,
								default: "0 0 0"
							}
						}
					},
					building6: {
						type: Object,
						properties: {
							name: {
								type: String,
								required: true,
								default: "None"
							},
							position: {
								type: String,
								required: true,
								default: "0 0 0"
							}
						}
					}
				}
			}
        }
	},
	nearCount:{
		type:Number,
		required:true
	},
	img_name: {
		type: String,
		required:true,
		default: "empty"
	}
})

module.exports = mongoose.model("Image",imageSchema);
// properties: nameOfModel, schemaUsed