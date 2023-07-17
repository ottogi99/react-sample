import "./TodoList.css";
import TodoItem from "./TodoItem";
import { useMemo, useState } from "react";

const TodoList = ({ todo, onUpdate, onDelete }) => {
  const analyzeTodo = useMemo(() => { // 이 useMemo는 todo값이 변할 때만 첫 번째 인수로 전달한 콜백 함수를 호출하고 결과값을 반환합니다.
    console.log("analyzeTodo 함수 호출");
    const totalCount = todo.length;
    const doneCount = todo.filter((it) => it.isDone).length;
    const notDoneCount = totalCount - doneCount;

    return {
      totalCount,
      doneCount,
      notDoneCount,
    };
  }, [todo]);
  const { totalCount, doneCount, notDoneCount } = analyzeTodo;  // useMemo는 함수가 아닌 값을 반환하므로 analyzeTodo로 변경해야 합니다.

  const [search, setSearch] = useState("");
  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };
  const getSearchResult = () => {
    return search === ""
    ? todo
    : todo.filter((it) => it.content.toLowerCase().includes(search.toLowerCase()));
  };

  return (
    <div className="TodoList">
      <h4>Todo List 📃</h4>
      <div>
        <div>총개수: {totalCount}</div>
        <div>완료된 일: {doneCount}</div>
        <div>아직 완료하지 못한 할 일: {notDoneCount}</div>
      </div>
      <input 
        value={search}
        onChange={onChangeSearch}
        className="searchbar" 
        placehodler="검색어를 입력하세요" />
      <div className="list_wrapper">
        {getSearchResult().map((it) => (
          <TodoItem key={it.id} {...it} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

export default TodoList;