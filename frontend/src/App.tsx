import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/post").then((res) => {
      setPosts(res.data);
    });
    api.post("/post", {
      title: "Hello",
      content: "From frontend",
    });
  }, []);

  return (
    <div>
      <h1>Post list</h1>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
