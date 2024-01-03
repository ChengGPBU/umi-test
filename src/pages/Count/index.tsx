import { PageContainer } from "@ant-design/pro-components";
import { useModel } from "@umijs/max";
import { Button } from "antd";
import Counter from "./components/Counter"

const TodoPage: React.FC = () => {
  const { increment, decrement } = useModel("Count.countModel");
  const { setName } = useModel("global");

  const modifyName = () => { 
    setName("admin")
  }
  return (
    <PageContainer ghost>
      <Counter />
      <Button onClick={increment}>increment</Button>
      <Button onClick={decrement}>decrement</Button>
      <Button onClick={modifyName}>修改name为admin</Button>
    </PageContainer>
  );
};

export default TodoPage;
