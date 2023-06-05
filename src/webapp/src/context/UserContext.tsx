import React, { createContext, useCallback, useEffect, useState } from "react";
import { UserContextType } from "../models/UserContextType";
import { User } from "../models/User";
import { ACCESS_TOKEN } from "../constants/constants";
import { UserApi } from "../api/UserApi";

const defaultSettings: UserContextType = {
  currentUser: null,
  userModifier: (user: User | null) => {},
};

export const UserContext = createContext<UserContextType>(defaultSettings);

export const UserContextProvider = (props: React.PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const userModifier = (user: User | null) => {
    setCurrentUser(user);
  };

  const fetchUser = useCallback(async () => {
    const user = await UserApi.getUser();
    userModifier({
      email: user.data.email,
      username: user.data.username,
      roles: user.data.roles,
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    // TODO Handle check validity of JWT (expiration time check) https://www.npmjs.com/package/jwt-decode
    if (token && !currentUser) {
      fetchUser();
    }
  }, [fetchUser, currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, userModifier }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
