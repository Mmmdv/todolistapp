import { COLORS } from "@/constants/ui";
import useTodo from "@/hooks/useTodo";
import Header from "@/layout/Header";
import TodoCreator from "@/layout/TodoCreator";
import TodoList from "@/layout/TodoList";
import { useEffect } from "react";
import { Platform, StatusBar, StyleSheet, UIManager, View } from "react-native";

export default function Index() {

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  const {
    todos,
    completedTodos,
    archivedTodos,
    onAddTodo,
    onDeleteTodo,
    onEditTodo,
    onCheckTodo,
    onArchiveTodo,
    onArchiveAll,
    onClearArchive,
  } = useTodo();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"}></StatusBar>
      <Header totalTodos={todos.length} completedTodos={completedTodos.length}></Header>
      <TodoCreator onAddTodo={onAddTodo} />
      <TodoList
        todos={todos}
        onDeleteTodo={onDeleteTodo}
        onCheckTodo={onCheckTodo}
        onEditTodo={onEditTodo}
        onArchiveTodo={onArchiveTodo}
        onArchiveAll={onArchiveAll}
        onClearArchive={onClearArchive}
        archivedTodos={archivedTodos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
    paddingBottom: 100,
  },
});
