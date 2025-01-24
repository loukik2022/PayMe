import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { getALLSubcriptions } from '../api/subscriptionAPI.js'
import { createPayment } from "../api/transactionAPI.js";

const Subscriptions = () => {
  // hard-code subscription plans details (incase of failure)
  let defaultPlans = [
    {
      id: 1,
      name: "Basic Plan",
      price: "₹10,000",
      billingCycle: "monthly",
      description: "Ideal for single small project with essential integrations and basic support.",
      features: [
        "One project",
        "One database server integration",
        "One external API service integration",
        "Basic support"
      ],
    },
    {
      id: 2,
      name: "Standard Plan",
      price: "₹1,00,0000",
      billingCycle: "yearly",
      description: "Perfect for growing businesses with multiple projects and priority support.",
      features: [
        "Up to five projects",
        "Two database server integrations",
        "Three external API service integrations",
        "Priority support",
        "Access to standard features"
      ],
    },
    {
      id: 3,
      name: "Premium Plan",
      price: "₹25,00,000",
      billingCycle: "yearly",
      description: "Comprehensive solution for unlimited projects and premium features with dedicated support.",
      features: [
        "Unlimited projects",
        "Unlimited database server integrations",
        "Unlimited external API service integrations",
        "Access to all premium features",
        "Available physically 8 hours per day"
      ],
    }
  ];

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getALLSubcriptions()
      .then(plans => {

        // Extract only name, price, and description from plans
        const filteredPlans = plans.map(plan => ({
          id: plan._id,
          name: plan.planName,
          price: plan.price,
          billingCycle: plan.billingCycle,
          description: plan.description || 'No description available',
          features: plan.features || 'No features available'
        }));

        filteredPlans.sort((a, b) => a.price - b.price);

        setPlans(filteredPlans);
      })
      .catch((error) => {
        console.error(error)
        setPlans(defaultPlans)
      })
      .finally(() => {
        setLoading(false); // Stop loading after fetch completes
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (plans.length === 0) {
    return <div>No plans available.</div>;
  }

  const handleSubmit = async (planId, e) => {
    e.preventDefault();
    console.log("Processing purchase...");

    // send planID (client->backend)
    createPayment({
      planId: planId
    })
  };

  return (
    <div className="subs-container">
      {plans.map((plan, index) => (
        <div key={index} className="sub-card">
          <h2>{plan.name}</h2>
          <h3>{`${plan.price} / ${plan.billingCycle}`}</h3>
          <p>{plan.description}</p>
          <button onClick={(e) => handleSubmit(plan.id, e)}>Get Started</button>
          <ul>
            {plan.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Subscriptions;
