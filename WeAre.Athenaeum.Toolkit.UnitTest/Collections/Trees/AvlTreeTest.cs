using WeAre.Athenaeum.Toolkit.Collections.Trees;

namespace WeAre.Athenaeum.Toolkit.UnitTest.Collections.Trees
{
    public class AvlTreeTest : BaseTreeTest
    {
        protected override IBinaryTree<long, Value> Create()
        {
            return new AvlTree<long, Value>();
        }

        protected override void Sort<T>(T[] items)
        {
            AvlTree<object, object>.Sort(items);
        }
    }
}