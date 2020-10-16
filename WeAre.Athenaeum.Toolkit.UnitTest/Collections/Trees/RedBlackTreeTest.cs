using WeAre.Athenaeum.Toolkit.Collections.Trees;

namespace WeAre.Athenaeum.Toolkit.UnitTest.Collections.Trees
{
    public class RedBlackTreeTest : BaseTreeTest
    {
        protected override IBinaryTree<long, Value> Create()
        {
            return new RedBlackTree<long, Value>();
        }

        protected override void Sort<T>(T[] items)
        {
            RedBlackTree<object, object>.Sort(items);
        }
    }
}