import moment from "moment";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Feed, Placeholder, Popup } from "semantic-ui-react";

function MyPopup({ content: { username, posts }, children }) {
  const [data, setData] = useState(null);
  const timer = useRef();

  return (
    <Popup
      on="click"
      onClose={() => {
        setData(null);
        clearTimeout(timer.current);
      }}
      onOpen={() => {
        setData(null);

        timer.current = setTimeout(() => {
          setData({
            description: "fakeDesc",
            name: "Fakename",
            title: "faketitle",
          });
        }, 2000);
      }}
      popperDependencies={[!!data]}
      trigger={children}
      wide
    >
      {data === null ? (
        <Placeholder style={{ minWidth: "200px" }}>
          <Placeholder.Header>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line length="medium" />
            <Placeholder.Line length="short" />
          </Placeholder.Paragraph>
        </Placeholder>
      ) : (
        <Card>
          <Card.Content>
            <Card.Header>Recent Activity</Card.Header>
          </Card.Content>
          <Card.Content>
            {posts &&
              posts.map((post) => (
                <Link to={`/posts/${post.id}`}>
                  <Feed className="popup-feed">
                    <Feed.Event>
                      <Feed.Label image="https://react.semantic-ui.com/images/avatar/small/molly.png" />
                      <Feed.Content>
                        <Feed.Date content={moment(post.createdAt).fromNow()} />
                        <Feed.Summary>{post.body}</Feed.Summary>
                      </Feed.Content>
                    </Feed.Event>
                  </Feed>
                </Link>
              ))}
          </Card.Content>
        </Card>
      )}
    </Popup>
  );
}

export default MyPopup;
