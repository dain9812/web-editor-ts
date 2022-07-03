import "./App.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";

function App() {
  const ref = useRef("");
  const changeRef = useRef(false);
  const changeCountRef = useRef(0);
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
  const [content, setContent] = useState<string>(() => {
    const tmp = localStorage.getItem("tmp");
    return tmp ?? "";
  });

  useEffect(() => {
    changeCountRef.current++;
    ref.current = content;
    changeRef.current = true;

    if (changeCountRef.current > 15) {
      changeCountRef.current = 0;
      changeRef.current = false;
      localStorage.setItem("tmp", ref.current);
      console.log("많은 변화에 의해 바로 저장");
    }
  }, [content]);

  useEffect(() => {
    const intv = setInterval(() => {
      console.log("인터벌 시작");
      if (changeRef.current) {
        console.log(ref.current, "값이 바뀜");
        localStorage.setItem("tmp", ref.current);
        changeRef.current = false;
        changeCountRef.current = 0;
      }
    }, 3000);

    return () => clearInterval(intv);
  }, []);

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
            localStorage.removeItem("tmp");
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
