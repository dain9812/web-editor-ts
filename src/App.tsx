import "./App.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";

function App() {
  const [post, setPost] = useState<string[]>(() => {
    const data = localStorage.getItem("data");

    try {
      if (data) return JSON.parse(data);
      return [];
    } catch (e) {
      localStorage.removeItem("data");
      return [];
    }
  });
  const [content, setContent] = useState<string>("");

  return (
    <div>
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#fff",
          paddingBottom: "8px",
          borderBottom: post.length > 0 ? "1px solid #eee" : "",
        }}
      >
        <button
          onClick={() => {
            if (content.length === 0) {
              alert("입력된 내용이 없습니다!");
              return;
            }
            setPost((prev) => {
              const rs = [...prev, content];
              localStorage.setItem("data", JSON.stringify(post));
              return rs;
            });
            setContent("");
          }}
        >
          작성
        </button>
        <button
          onClick={() => {
            if (window.confirm("정말 초기화 하겠습니까?")) {
              localStorage.clear();
              setPost([]);
            }
          }}
        >
          초기화
        </button>
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={{
            toolbar: [
              ["image"],
              ["bold", "italic", "underline", "strike"], // toggled buttons
              ["blockquote", "code-block"],

              [{ header: 1 }, { header: 2 }], // custom button values
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }], // superscript/subscript
              [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
              [{ direction: "rtl" }], // text direction

              [{ size: ["small", false, "large", "huge"] }], // custom dropdown
              [{ header: [1, 2, 3, 4, 5, 6, false] }],

              [{ color: [] }, { background: [] }], // dropdown with defaults from theme
              [{ font: [] }],
              [{ align: [] }],

              ["clean"],
            ],
          }}
        />
      </div>
      <div>
        {post.map((post, idx) => (
          <div key={idx}>
            <div dangerouslySetInnerHTML={{ __html: post }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
