const calculateReward = (user) => {
  const COIN_BONUS = 10;
  const STREAK_BONUS = 5;

  const reward = COIN_BONUS + user.streakCount * STREAK_BONUS;
  return reward;
};

const saveUser = (user, token) => {
  const save = {
    user,
    token,
  };
  localStorage.setItem("dappback-user", JSON.stringify(save));
};

const clearUser = () => {
  localStorage.removeItem("dappback-user");
};

const customModalStyles = {
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

export { calculateReward, customModalStyles, saveUser, clearUser };
