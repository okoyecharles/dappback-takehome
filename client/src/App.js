import { useState } from "react";
import Button from "./components/Button/Button";
import Logo from "./components/assets/logo.png";
import Coin from "./components/assets/coin.png";
import DBCoin from "./components/assets/db-coin.png";
import Avatar from "./components/assets/avatar.png";
import Flame from "./components/assets/flame.png";

import Pluralize from "react-pluralize";

function App() {
  const [coinCount, setCoinCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [rewardCount, setRewardCount] = useState(10);

  return (
    <main className="App flex flex-col">
      <div className="wrapper max-w-[1200px] w-full mx-auto text-secondary-200">
        <nav className="flex p-4">
          <div className="logo">
            <img src={Logo} alt="logo" className="h-[2rem]" />
          </div>
          <div className="profile-wrapper ml-auto flex gap-2">
            <div className="coin-count flex gap-2 bg-primary-200 rounded-md p-2 h-[2rem]">
              <img src={Coin} alt="coin-image" className="select-none pointer-events-none"/>
              <span className="self-center">{coinCount}</span>
            </div>
            <div className="profile-avatar">
              <img src={Avatar} alt="profile-image" className="h-[2rem]" />
            </div>
          </div>
        </nav>

        <div className="content p-4">
          <h1 className="text-2xl text-white font-medium mt-6">
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
                    <Pluralize singular={"day"} count={streakCount} />
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
                    <Pluralize singular={"coin"} count={rewardCount} />
                  </span>
                  <span>Today's reward</span>
                </div>
              </div>
            </div>

            <p className="my-6 text-center">
              Welcome to the Daily Streaks Rewards program! Click the button
              below every day to earn valuable coins. The more consecutive days
              you participate, the greater the rewards you'll unlock. Let's
              start building your streak today!
            </p>

            <div className="flex justify-center">
              <Button>Claim Reward</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
