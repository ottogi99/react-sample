import "./App.css";
import Header from "./component/Header";
import TodoEditor from "./component/TodoEditor";
import TodoList from "./component/TodoList";

import React, { useMemo, useRef, useReducer, useCallback } from "react";
import TestComp from "./component/TestComp";

export const TodoStateContext = React.createContext();
export const TodoDispatchContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return [action.newItem, ...state];
    case "UPDATE":
      return state.map((it) => it.id === action.targetId ? { ...it, isDone: !it.isDone, } : it);
    case "DELETE":
      return state.filter((it) => it.id !== action.targetId);
    default:
      return state;
  }
}

const mockTodo = [
  {
    id: 0,
    isDone: true,
    content: "React 공부하기",
    createdDate: new Date().getTime(),
  },
  {
    id: 1,
    isDone: false,
    content: "빨래 넣기",
    createdDate: new Date().getTime(),
  },
  {
    id: 2,
    isDone: false,
    content: "노래 연습하기",
    createdDate: new Date().getTime(),
  },
];

function App() {
  const idRef = useRef(3);  // idRef의 초기값을 3으로 설정 (목데이터의 id가 0,1,2이기 때문에)
  const [todo, dispatch] = useReducer(reducer, mockTodo);

  const onCreate = (content) => {
    dispatch({
      type: "CREATE",
      newItem: {
        id: idRef.current,
        content,
        isDone: false,
        createdDate: new Date().getTime(),
      },
    });
    idRef.current += 1;
  };

  const onUpdate = useCallback((targetId) => { 
    dispatch({
      type: "UPDATE",
      targetId,
    });
  }, []);

  const onDelete = useCallback((targetId) => {
    dispatch({
      type: "DELETE",
      targetId,
    });
  }, []);

  // todo가 변경되어 App 컴포넌트를 리렌더 하면 TodoDispatchContext.Provider에 Props로 전달하는 3개의 함수를 다시 생성합니다.
  // 따라서 useMemo를 이용해 TodoDispatchContext.Provider에 전달할 dispatch 함수를 다시 생성하지 않도록 만들어야 합니다.
  const memorizedDispatches = useMemo(() => {
    return { onCreate, onUpdate, onDelete };
  }, []);

  return (
    <div className="App">
      <TestComp />
      <Header />
      <TodoStateContext.Provider value={todo}>
        <TodoDispatchContext.Provider value={memorizedDispatches}>
          <TodoEditor />
          <TodoList />
        </TodoDispatchContext.Provider>
      </TodoStateContext.Provider>
    </div>
  );
}

export default App;