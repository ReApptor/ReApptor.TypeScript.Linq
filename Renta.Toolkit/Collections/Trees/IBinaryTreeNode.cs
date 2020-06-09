namespace Renta.Toolkit.Collections.Trees
{
    public interface IBinaryTreeNode<out TKey, TValue>
    {
        IBinaryTreeNode<TKey, TValue> Left { get; }

        IBinaryTreeNode<TKey, TValue> Right { get; }
        
        TKey Key { get; }
        
        TValue Value { get; set; }
    }
}