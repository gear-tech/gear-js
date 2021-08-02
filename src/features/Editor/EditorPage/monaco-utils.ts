export class MonacoUtils {
  static Tree: any;

  static ContextSubMenu: any;

  static ContextMenuService: any;

  static ContextViewService: any;

  static TreeDefaults: any;

  static Action: any;

  static async initialize() {
    // Dynamic import of monaco-editor (will be globally accessible)
    await import(/* webpackChunkName: "monaco-editor" */ 'monaco-editor');
    // @ts-ignore
    const { Action } = await import(/* webpackChunkName: "monaco-editor" */ 'monaco-editor/esm/vs/base/common/actions');
    const { ContextSubMenu } = await import(
      // @ts-ignore
      /* webpackChunkName: "monaco-editor" */ 'monaco-editor/esm/vs/base/browser/contextmenu'
    );
    const { ContextMenuService } = await import(
      // @ts-ignore
      /* webpackChunkName: "monaco-editor" */ 'monaco-editor/esm/vs/platform/contextview/browser/contextMenuService'
    );
    const { ContextViewService } = await import(
      // @ts-ignore
      /* webpackChunkName: "monaco-editor" */ 'monaco-editor/esm/vs/platform/contextview/browser/contextViewService'
    );
    const { Tree } = await import(
      // @ts-ignore
      /* webpackChunkName: "monaco-editor" */ 'monaco-editor/esm/vs/base/browser/ui/tree/tree'
    );
    MonacoUtils.Action = Action;
    MonacoUtils.ContextSubMenu = ContextSubMenu;
    MonacoUtils.ContextMenuService = ContextMenuService;
    MonacoUtils.ContextViewService = ContextViewService;
    MonacoUtils.Tree = Tree;
  }

  static expandTree(tree: any) {
    const { model } = tree;
    const elements = [];

    let item;
    const nav = model.getNavigator();

    // eslint-disable-next-line no-cond-assign
    while ((item = nav.next())) {
      elements.push(item);
    }

    for (let i = 0, len = elements.length; i < len; i++) {
      model.expand(elements[i]);
    }
  }
}
