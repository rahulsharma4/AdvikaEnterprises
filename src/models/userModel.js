const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'staff', 'telecaller'],
      default: 'staff',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    tokenVersion: {
      type: Number,
      required: true,
      default: 0,
    },
    companyDetails: {
      fbPageId: { type: String, default: '' },
      fbPageAccessToken: { type: String, default: '' },
      fbPageName: { type: String, default: '' },
      fbAccessToken: { type: String, default: '' },
      globalTerms: { type: String, default: `1. Scope: Supply, installation, testing and commissioning as per approved quotation and specifications.\n2. Payment: Payment shall be made as per agreed milestones/payment terms.\n3. Taxes & Charges: GST and applicable statutory/DISCOM charges shall be extra unless specified.\n4. Site & Approvals: Customer shall provide site readiness, access and required documents; approvals are subject to authority timelines.\n5. Timeline: Completion is subject to site readiness, material availability, approvals and force majeure.\n6. Variation: Any additional work or changes in scope shall be charged extra with Customer approval.\n7. Warranty & Generation: Warranty shall be as per applicable terms; generation may vary due to weather, irradiation, shading and grid conditions.\n8. O&M & Liability: Routine maintenance is Customer's responsibility unless separately agreed; Vendor shall not be liable for external/force majeure damages.` },
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  try {
    // Using 8 rounds for a balance between security and speed on all systems
    this.password = await bcrypt.hash(this.password, 8);
  } catch (error) {
    throw error;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
