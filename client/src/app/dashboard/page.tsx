"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/auth/AuthContext";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated and not loading
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1>Welcome to Raahi Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      <div className={styles.welcomeSection}>
        <div className={styles.userInfo}>
          <h2>Hello, {user?.name}!</h2>
          <p>Your personal travel planning journey begins here.</p>
        </div>
      </div>

      <div className={styles.dashboardContent}>
        <div className={styles.dashboardCard}>
          <h3>My Trips</h3>
          <p>You don't have any trips planned yet. Start by creating your first trip!</p>
          <Button>Create New Trip</Button>
        </div>

        <div className={styles.dashboardCard}>
          <h3>Recommended Destinations</h3>
          <div className={styles.recommendationList}>
            <div className={styles.recommendation}>
              <div className={styles.recommendationImage} style={{ backgroundColor: "#f0f0f0" }}>
                <span>Paris</span>
              </div>
              <p>Paris, France</p>
            </div>
            <div className={styles.recommendation}>
              <div className={styles.recommendationImage} style={{ backgroundColor: "#f0f0f0" }}>
                <span>Tokyo</span>
              </div>
              <p>Tokyo, Japan</p>
            </div>
            <div className={styles.recommendation}>
              <div className={styles.recommendationImage} style={{ backgroundColor: "#f0f0f0" }}>
                <span>Bali</span>
              </div>
              <p>Bali, Indonesia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
