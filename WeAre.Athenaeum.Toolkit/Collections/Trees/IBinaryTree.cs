using System;
using System.Collections.Generic;

namespace WeAre.Athenaeum.Toolkit.Collections.Trees
{
    public interface IBinaryTree<TKey, TValue>
    {
        TValue Remove(TKey key);

        TValue BinarySearch(TKey key);

        bool Add(TKey key, TValue value);
        
        void Clear();
        
        bool Contains(TKey key);

        IBinaryTreeNode<TKey, TValue> FindNode(TKey key);
    
        void InfixTraverse(Action<TKey, TValue> action);

        void PrefixTraverse(Action<TKey, TValue> action);

        void PostfixTraverse(Action<TKey, TValue> action);
        
        KeyValuePair<TKey, TValue>[] ToArray();

        bool CheckBalance();
        
        IComparer<TKey> Comparer { get; }
        
        IBinaryTreeNode<TKey, TValue> Root { get; }
        
        int Count { get; }
        
        int Depth { get; }
    }
}