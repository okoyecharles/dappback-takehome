import React, { useMemo, useState } from "react";
import Button from "../Button/Button";
import Logo from "../assets/logo.png";
import Coin from "../assets/coin.png";
import DBCoin from "../assets/db-coin.png";
import Avatar from "../assets/avatar.png";
import Flame from "../assets/flame.png";

import Pluralize from "react-pluralize";
import Modal from "react-modal";
import Form from "../Form/Form";
import moment from "moment";
import axios from "axios";
import { calculateReward, clearUser, customModalStyles, saveUser } from "../../utils";
import { BACKEND_URL } from "../../config";

Modal.setAppElement("#root");

function App() {
  const [userUpdate, setUserUpdate] = useState({});
  const { user, token } = useMemo(() => {
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
  const rewardClaimed = useMemo(() => {
    if (!user) return false;
    const lastStreak = moment(user.lastStreak);
    const today = moment();
    return lastStreak.isSame(today, "day");
  }, [user]);

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

      saveUser(data.user, token);
      setRewardLoading(false);
      setUserUpdate({});
    } catch (error) {
      setRewardError(error.response.data.message);
      setRewardLoading(false);
      return;
    }

    setRewardLoading(true);
    setRewardError(null);
  };

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
                  clearUser();
                  closeModal();
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
        style={customModalStyles}
      >
        <Form closeModal={closeModal} setUserUpdate={setUserUpdate} />
      </Modal>
    </main>
  );
}

export default App;
