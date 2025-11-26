import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OnboardingForm {
  age: number;
  location: string;
  household_size: number;
  diet_type: string;
  transport_primary: string;
  has_pets: boolean;
  monthly_electricity_kwh?: number;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingForm>({
    age: 0,
    location: "",
    household_size: 1,
    diet_type: "omnivore",
    transport_primary: "car",
    has_pets: false,
    monthly_electricity_kwh: 0,
  });

  const handleSubmit = () => {
    // Save onboarding data (could send to API in future)
    localStorage.setItem("onboarding_complete", "true");
    localStorage.setItem("onboarding_data", JSON.stringify(formData));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-eco-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to Carbon Tracker! 🌱</CardTitle>
          <CardDescription className="text-center">
            Let's set up your profile to get accurate carbon tracking ({step}/3)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  min="13"
                  max="120"
                  value={formData.age || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, age: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="New York, USA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Household Size</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.household_size}
                  onChange={(e) =>
                    setFormData({ ...formData, household_size: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!formData.age || !formData.location}
                className="w-full"
              >
                Next →
              </Button>
            </div>
          )}

          {/* Step 2: Lifestyle */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Diet Type</label>
                <select
                  value={formData.diet_type}
                  onChange={(e) =>
                    setFormData({ ...formData, diet_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescatarian">Pescatarian</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Primary Transportation
                </label>
                <select
                  value={formData.transport_primary}
                  onChange={(e) =>
                    setFormData({ ...formData, transport_primary: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="car">Car</option>
                  <option value="public_transport">Public Transport</option>
                  <option value="electric_vehicle">Electric Vehicle</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="walking">Walking</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Monthly Electricity Usage (kWh)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={formData.monthly_electricity_kwh || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthly_electricity_kwh: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="300"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Optional - leave blank if unknown
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="has_pets"
                  checked={formData.has_pets}
                  onChange={(e) =>
                    setFormData({ ...formData, has_pets: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="has_pets" className="text-sm font-medium">
                  Do you have pets?
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  ← Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Next →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-eco-green/10 rounded-lg space-y-2">
                <p className="font-semibold">Review Your Profile</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Age:</span> {formData.age}
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span> {formData.location}
                  </div>
                  <div>
                    <span className="text-gray-600">Household:</span> {formData.household_size} people
                  </div>
                  <div>
                    <span className="text-gray-600">Diet:</span> {formData.diet_type}
                  </div>
                  <div>
                    <span className="text-gray-600">Transport:</span> {formData.transport_primary}
                  </div>
                  <div>
                    <span className="text-gray-600">Pets:</span> {formData.has_pets ? "Yes" : "No"}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  ← Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Complete Setup 🎉
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
