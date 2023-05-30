import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import Button from "./components/Button/Button";
import Logo from "./components/assets/logo.png";
import Coin from "./components/assets/coin.png";
import DBCoin from "./components/assets/db-coin.png";
import Avatar from "./components/assets/avatar.png";
import Flame from "./components/assets/flame.png";

import Pluralize from "react-pluralize";
import Modal from "react-modal";
import Form from "./components/Form/Form";
import moment from "moment";
import axios from "axios";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    backgroundColor: "#313146",
    maxWidth: "600px",
    width: "calc(100% - 2rem)",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    border: "none",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};

const BACKEND_URL = "http://localhost:4000";

const COIN_BONUS = 10;
const STREAK_BONUS = 5;
const calculateReward = (user) => {
  const reward = COIN_BONUS + user.streakCount * STREAK_BONUS;
  return reward;
};

function App() {
  // try to retrieve user and token data from local storage if it exists in useEffect
  const [userUpdate, setUserUpdate] = useState({});
  const { user, token } = useMemo(() => {
    console.log("updating user");
    const data = localStorage.getItem("dappback-user");
    if (data) {
      return JSON.parse(data);
    } else {
      return {
        user: null,
        token: null,
      };
    }
  }, [userUpdate]);

  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen((prev) => !prev);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const [rewardError, setRewardError] = useState(null);
  const [rewardLoading, setRewardLoading] = useState(null);

  const claimReward = async () => {
    if (!user) {
      setRewardError("Please log in to claim your reward!");
      return;
    }

    if (rewardClaimed) {
      setRewardError("You have already claimed your reward today!");
      return;
    }

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/users/claim`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Save user and token to local storage
      const save = {
        user: data.user,
        token,
      };
      setRewardLoading(false);

      localStorage.setItem("dappback-user", JSON.stringify(save));
      setUserUpdate({});
    } catch (error) {
      setRewardError(error.response.data.message);
      setRewardLoading(false);
      return;
    }

    setRewardLoading(true);
    setRewardError(null);
  };

  const rewardClaimed = useMemo(() => {
    if (!user) return false;
    const lastStreak = moment(user.lastStreak);
    const today = moment();
    return lastStreak.isSame(today, "day");
  }, [user]);

  return (
    <main className="App flex flex-col" id="app">
      <div className="wrapper max-w-[1200px] w-full mx-auto text-secondary-200">
        <nav className="flex p-4">
          <div className="logo">
            <img src={Logo} alt="logo" className="h-[2rem]" />
          </div>
          <div className="profile-wrapper ml-auto flex gap-4">
            <div className="coin-count flex gap-2 bg-primary-200 rounded-md p-2 h-[2rem]">
              <img
                src={Coin}
                alt="coin-image"
                className="select-none pointer-events-none"
              />
              <span className="self-center">{user?.coins || 0}</span>
            </div>
            <div
              className="profile-avatar flex items-center gap-2 relative hover:cursor-pointer"
              onClick={openModal}
            >
              <img src={Avatar} alt="profile-image" className="h-[2rem] " />
              <span>{user?.name.split(" ")[0] || "Guest"}</span>
              <button
                className={`logout absolute top-[calc(100%+1rem)] right-0 bg-primary-300 p-2 py-1 rounded-md ${
                  modalIsOpen && user
                    ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
                    : "-translate-y-4 opacity-0 scale-50 pointer-events-none"
                } transition-all`}
                onClick={() => {
                  closeModal();
                  localStorage.removeItem("dappback-user");
                  setUserUpdate({});
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="content p-4">
          <h1 className="text-2xl text-white font-medium md:mt-6">
            Daily Streaks
          </h1>
          <p className="flex gap-2">
            <span>Earn</span>{" "}
            <img
              src={DBCoin}
              alt="null"
              className="h-6 select-none pointer-events-none"
            />{" "}
            <span>Dappback coins everyday</span>
          </p>

          <div className="bg-gradient-to-b from-primary-200 to-primary-100 p-10 mt-6 rounded">
            <div className="streak-reward flex justify-center">
              <div className="streak-reward-wrapper flex flex-col gap-6 md-gap-0 md:flex-row justify-between w-full max-w-[600px]">
                <div className="streak flex flex-col items-center">
                  <img
                    src={Flame}
                    alt="streak-icon"
                    className="h-[200px] select-none pointer-events-none"
                  />
                  <span className="font-bold text-white mt-4">
                    <Pluralize
                      singular={"day"}
                      count={user?.streakCount || 0}
                    />
                  </span>
                  <span>Current streak</span>
                </div>
                <div className="reward flex flex-col items-center">
                  <img
                    src={DBCoin}
                    alt="streak-icon"
                    className="h-[200px] select-none pointer-events-none"
                  />
                  <span className="font-bold text-white mt-4">
                    <Pluralize
                      singular={"coin"}
                      count={user ? calculateReward(user) : 0}
                    />
                  </span>
                  <span>
                    {rewardClaimed ? "Tomorrow's reward" : "Today's reward"}
                  </span>
                </div>
              </div>
            </div>

            <p className="my-6 text-center">
              Welcome to the Daily Streaks Rewards program! Click the button
              below every day to earn valuable coins. The more consecutive days
              you participate, the greater the rewards you'll unlock. Let's
              start building your streak today!
            </p>

            <div className="flex items-center flex-col">
              <Button
                onClick={claimReward}
                disabled={rewardLoading || rewardClaimed}
              >
                {rewardClaimed
                  ? "Today's reward claimed"
                  : rewardLoading
                  ? "Claiming..."
                  : "Claim Reward"}
              </Button>
              <span className="reward-error text-ss opacity-95 mt-4">
                {rewardError}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen && !user}
        onRequestClose={closeModal}
        contentLabel="Login Modal"
        style={customStyles}
      >
        <Form closeModal={closeModal} setUserUpdate={setUserUpdate} />
      </Modal>
    </main>
  );
}

export default App;
