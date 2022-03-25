import React, { useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

//context
import { AuthContext } from "../context/auth";

function MenuBar() {
  //we get path = "/" or "/login" or "/register"
  var path = window.location.pathname.substring(1);
  if (path === "") path = "home";

  const { user, logout } = useContext(AuthContext); //AuthContext is obj having { user, login(), logout() }
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const logoutUser = () => {
    logout();
  };

  const menuBar = user ? (
    <div>
      <Menu pointing secondary size="massive" color="blue">
        <Menu.Item
          name={user.username}
          active
          as={Link}
          to="/"
          style={{ letterSpacing: 1, fontWeight: 600 }}
        />

        <Menu.Menu position="right">
          <Menu.Item
            name="Logout"
            onClick={logoutUser}
            style={{ letterSpacing: 1, fontWeight: 600 }}
          />
        </Menu.Menu>
      </Menu>
    </div>
  ) : (
    <div>
      <Menu pointing secondary size="massive" color="blue">
        <Menu.Item
          name="home"
          active={activeItem === "home"}
          onClick={handleItemClick}
          as={Link}
          to="/"
        />

        <Menu.Menu position="right">
          <Menu.Item
            name="login"
            active={activeItem === "login"}
            onClick={handleItemClick}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name="register"
            active={activeItem === "register"}
            onClick={handleItemClick}
            as={Link}
            to="/register"
          />
        </Menu.Menu>
      </Menu>
    </div>
  );

  return menuBar;
}

export default MenuBar;
