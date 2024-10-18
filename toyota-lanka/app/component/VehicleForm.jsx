"use client";

import { useState } from "react";

const VehicleForm = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    body_type: "",
    registration_number: "",
    mileage: "",
    engine_cc: "",
    fuel_type: "",
    year_of_manufacture: "",
    district: "",
    vehicle_grade: "",
    exterior_color: "",
    interior_color: "",
    num_owners: "",
    images: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        images: Array.from(files),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(""); // Clear previous message

    const data = new FormData();
    for (const key in formData) {
      if (key === "images") {
        formData.images.forEach((image) => {
          data.append("images", image);
        });
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage(result.message);
        // Reset form data if needed
        setFormData({
          make: "",
          model: "",
          body_type: "",
          registration_number: "",
          mileage: "",
          engine_cc: "",
          fuel_type: "",
          year_of_manufacture: "",
          district: "",
          vehicle_grade: "",
          exterior_color: "",
          interior_color: "",
          num_owners: "",
          images: [],
        });
      } else {
        setSubmitMessage("Failed to submit vehicle");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage("Error submitting vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fuelTypes = ["Petrol", "Diesel", "Hybrid"];
  const districts = [
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Kandy",
    "Matale",
    "Nuwara Eliya",
    "Galle",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const numOwners = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div style={styles.formContainer}>
      <h1 className="text-lg font-semibold mb-4 text-black">
        Build Your Listing
      </h1>
      <h6 className="block mb-2 text-black">Listing Item Details</h6>
      <form
        onSubmit={handleSubmit}
        style={styles.vehicleForm}
        encType="multipart/form-data"
      >
        <div style={styles.formRow}>
          <div style={styles.column}>
            <div style={styles.formGroup}>
              <label htmlFor="make" style={styles.label}>
                Vehicle Make <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="body_type" style={styles.label}>
                Body Type
              </label>
              <input
                type="text"
                id="body_type"
                name="body_type"
                value={formData.body_type}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="mileage" style={styles.label}>
                Mileage(km)
              </label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="fuel_type" style={styles.label}>
                Fuel Type <span style={{ color: "red" }}>*</span>
              </label>
              <select
                id="fuel_type"
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select Fuel Type</option>
                {fuelTypes.map((fuel, index) => (
                  <option key={index} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="vehicle_grade" style={styles.label}>
                Vehicle Grade
              </label>
              <input
                type="text"
                id="vehicle_grade"
                name="vehicle_grade"
                value={formData.vehicle_grade}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="exterior_color" style={styles.label}>
                Exterior Color
              </label>
              <input
                type="text"
                id="exterior_color"
                name="exterior_color"
                value={formData.exterior_color}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.column}>
            <div style={styles.formGroup}>
              <label htmlFor="model" style={styles.label}>
                Vehical Model <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="registration_number" style={styles.label}>
                Vehicle Registration Number{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="engine_cc" style={styles.label}>
                Engine CC/KW
              </label>
              <input
                type="number"
                id="engine_cc"
                name="engine_cc"
                value={formData.engine_cc}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="year_of_manufacture" style={styles.label}>
                Year of Manufacture
              </label>
              <select
                id="year_of_manufacture"
                name="year_of_manufacture"
                value={formData.year_of_manufacture}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Year</option>
                {years.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="interior_color" style={styles.label}>
                Interior Color
              </label>
              <input
                type="text"
                id="interior_color"
                name="interior_color"
                value={formData.interior_color}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="num_owners" style={styles.label}>
                Number of Owners
              </label>
              <select
                id="num_owners"
                name="num_owners"
                value={formData.num_owners}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Number of Owners</option>
                {numOwners.map((num, index) => (
                  <option key={index} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="district" style={styles.label}>
                District
              </label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select District</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="images" style={styles.label}>
                Upload Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                onChange={handleChange}
                accept="image/*"
                style={styles.input}
              />
            </div>
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button
            type="submit"
            style={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Vehicle"}
          </button>
        </div>

        {submitMessage && <p style={styles.submitMessage}>{submitMessage}</p>}
      </form>
    </div>
  );
};

const styles = {
  formContainer: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  formTitle: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  vehicleForm: {
    display: "flex",
    flexDirection: "column",
  },
  formRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  column: {
    flex: "1",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    color: "black",
    display: "block",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
    color: "black",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  submitButton: {
    padding: "12px 24px",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  submitMessage: {
    marginTop: "20px",
    textAlign: "center",
    color: "#0070f3",
  },
};

export default VehicleForm;
