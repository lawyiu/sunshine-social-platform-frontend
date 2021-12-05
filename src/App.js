import "./App.css";
import React from "react";
import sun from "./sun.svg";
import cloud from "./cloud.svg";

const POSTS_API_URL = process.env.REACT_APP_POSTS_API_URL;

class Post extends React.Component {
  render() {
    return (
      <div className="max-w-xl rounded overflow-hidden shadow-lg mx-auto mt-3 mb-3 bg-white">
        <div className="px-6 py-4">
          <h3 className="font-bold text-xl mb-2 text-left">
            {this.props.post.title}
          </h3>
          <h4 className="font-bold text-s mb-2 text-left">
            By {this.props.post.username}
          </h4>
          <p className="text-gray-700 text-base text-left">
            {this.props.post.content}
          </p>
        </div>
      </div>
    );
  }
}

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      posts: [],
    };

    this.addPost = this.addPost.bind(this);
    this.loadPosts = this.loadPosts.bind(this);
  }

  componentDidMount() {
    this.loadPosts();
  }

  addPost(post) {
    this.state.posts.push(post);
    this.setState({ posts: this.state.posts });
  }

  loadPosts() {
    fetch(POSTS_API_URL + "/posts")
      .then((result) => result.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            posts: result,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  render() {
    const { error, isLoaded, posts } = this.state;
    if (error) {
      return <div> Error loading posts: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading posts...</div>;
    } else {
      return posts
        .slice(0)
        .reverse()
        .map((post, index) => <Post key={index} post={post} />);
    }
  }
}

class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      errorMsg: "",
      username: "",
      title: "",
      content: "",
    };

    this.onSubmitSuccessCallback = null;

    this.setSubmitSuccessCallback = this.setSubmitSuccessCallback.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
  }

  setSubmitSuccessCallback(callback) {
    this.onSubmitSuccessCallback = callback;
  }

  handleChange(event) {
    const val = event.target.value;

    switch (event.target.id) {
      case "username":
        this.setState({ username: val });
        break;

      case "title":
        this.setState({ title: val });
        break;

      case "content":
        this.setState({ content: val });
        break;

      default:
        console.warn("Unknown id for post form.");
    }
  }

  handleSubmit(event) {
    const formData = {
      username: this.state.username,
      title: this.state.title,
      content: this.state.content,
    };

    const postData = JSON.stringify(formData);

    this.setState({ errorMsg: "" });

    fetch(POSTS_API_URL + "/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postData,
    })
      .then((resp) => {
        switch (resp.status) {
          case 200:
            this.hideForm();
            this.clearForm();

            if (this.onSubmitSuccessCallback) {
              this.onSubmitSuccessCallback(formData);
            }

            break;

          case 400:
            resp.text().then((respErrMsg) => {
              this.setState({ errorMsg: "Error sending post: " + respErrMsg });
            });
            break;

          default:
        }
      })
      .catch((error) =>
        this.setState({ errorMsg: "Error sending post: " + error })
      );

    event.preventDefault();
  }

  clearForm() {
    this.setState({ username: "", title: "", content: "" });
  }

  showForm() {
    const { opened } = this.state;

    if (!opened) {
      this.setState({ opened: true });
    }
  }

  hideForm() {
    const { opened } = this.state;

    if (opened) {
      this.setState({ opened: false });
    }
  }

  render() {
    const { opened } = this.state;

    if (!opened) {
      return (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
          onClick={this.showForm}
        >
          Add a post
        </button>
      );
    } else {
      return (
        <div className="Post-Form">
          <form
            className="relative max-w-xl bg-white mx-auto shadow-lg rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={this.handleSubmit}
          >
            <button
              className="absolute top-0 right-0 bg-transparent text-blue-200 font-semibold hover:text-blue-700 py-2 px-4 rounded"
              onClick={this.hideForm}
            >
              X
            </button>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                placeholder="Title"
                value={this.state.title}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="content"
              >
                Post Text
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="content"
                type="text"
                placeholder="Your post here."
                value={this.state.postText}
                onChange={this.handleChange}
                required
              />
            </div>

            {this.state.errorMsg && (
              <p className="text-red-700 mb-4">{this.state.errorMsg}</p>
            )}

            <div className="flex items-center justify-between">
              <button
                className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
                type="button"
                onClick={this.hideForm}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      );
    }
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.postForm = React.createRef();
    this.posts = React.createRef();
  }

  componentDidMount() {
    this.postForm.current.setSubmitSuccessCallback(this.posts.current.addPost);
  }

  addClouds() {
    return (
      <>
        <img
          src={cloud}
          className="Cloud"
          alt="cloud"
          style={{ left: "5%", top: "15%" }}
        />
        <img
          src={cloud}
          className="Cloud"
          alt="cloud"
          style={{ left: "11%", top: "42%" }}
        />
        <img
          src={cloud}
          className="Cloud"
          alt="cloud"
          style={{ left: "8%", top: "65%" }}
        />

        <img
          src={cloud}
          className="Cloud"
          alt="cloud"
          style={{ left: "85%", top: "23%" }}
        />
        <img
          src={cloud}
          className="Cloud"
          alt="cloud"
          style={{ left: "78%", top: "48%" }}
        />
        <img
          src={cloud}
          className="Cloud"
          alt="cloud"
          style={{ left: "88%", top: "70%" }}
        />
      </>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <p>
            <img src={sun} className="App-logo" alt="sun" />
            &nbsp;Sunshine Social Media Platform
          </p>
        </div>

        <div className="Container mt-3">
          {this.addClouds()}
          <PostForm ref={this.postForm} />

          <div className="Posts-container">
            <Posts ref={this.posts} />
          </div>
        </div>

        <div className="App-footer"></div>
      </div>
    );
  }
}

export default App;
