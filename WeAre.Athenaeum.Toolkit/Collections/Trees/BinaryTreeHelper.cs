using System;
using System.Collections.Generic;

namespace WeAre.Athenaeum.Toolkit.Collections.Trees
{
    internal static class BinaryTreeHelper
    {        
        private static bool FillPath<TKey, TValue>(IBinaryTreeNode<TKey, TValue> root, List<IBinaryTreeNode<TKey, TValue>> nodes, IBinaryTreeNode<TKey, TValue> node)  
        {  
            // if root or node is NULL  
            // there is no path
            if ((root == null) || (node == null))
            {
                return false;
            }
          
            // if it is the required node
            // return true  
            if (root == node)
            {
                return true;
            }
            
            // push the node's value in 'nodes'  
            nodes.Add(root);
          
            // else check whether the required node lies  
            // in the left subtree or right subtree of  
            // the current node  
            if (FillPath(root.Left, nodes, node) || FillPath(root.Right, nodes, node))
            {
                return true;
            }

            // required node does not lie either in the  
            // left or right subtree of the current node  
            // Thus, remove current node's value from  
            // 'nodes' and then return false      
            nodes.RemoveAt(nodes.Count - 1);

            return false;
        }

        public static void Sort<T>(this IBinaryTree<T, int> tree, T[] items)
        {
            int length = items.Length;
            for (int i = 0; i < length; i++)
            {
                T item = items[i];
                if (!tree.Contains(item))
                {
                    tree.Add(item, 1);
                }
                else
                {
                    IBinaryTreeNode<T, int> node = tree.Root.FindNode(item, tree.Comparer);
                    node.Value++;
                }
            }

            int index = 0;
            InfixTraverse<IBinaryTreeNode<T, int>, T, int>(tree.Root, (key, value) =>
            {
                for (int i = 0; i < value; i++)
                {
                    items[index] = key;
                    index++;
                }
            });
        }
        
        public static TValue BinarySearch<TKey, TValue>(this IBinaryTreeNode<TKey, TValue> root, TKey key, IComparer<TKey> comparer)
        {
            IBinaryTreeNode<TKey, TValue> node = FindNode(root, key, comparer);
            return (node != null) ? node.Value : default;
        }

        public static IBinaryTreeNode<TKey, TValue> FindNode<TKey, TValue>(this IBinaryTreeNode<TKey, TValue> root, TKey key, IComparer<TKey> comparer)
        {
            int num;
            for (IBinaryTreeNode<TKey, TValue> node = root; node != null; node = (num < 0) ? node.Left : node.Right)
            {
                num = comparer.Compare(key, node.Key);
                if (num == 0)
                {
                    return node;
                }
            }
            
            return null;
        }

        public static int TreeDepth<TKey, TValue>(this IBinaryTreeNode<TKey, TValue> node)
        {
            return (node != null) ? 1 + Math.Max(TreeDepth(node.Left), TreeDepth(node.Right)) : 0;
        }

        public static IBinaryTreeNode<TKey, TValue>[] PathToRoot<TKey, TValue>(this IBinaryTreeNode<TKey, TValue> root, IBinaryTreeNode<TKey, TValue> node)
        {
            var path = new List<IBinaryTreeNode<TKey, TValue>>();

            FillPath(root, path, node);

            return path.ToArray();
        }

        public static int PathLength<TKey, TValue>(this IBinaryTreeNode<TKey, TValue> root, IBinaryTreeNode<TKey, TValue> node)
        {
            return root.PathToRoot(node).Length;
        }

        public static KeyValuePair<TKey, TValue> ToKeyValue<TKey, TValue>(this IBinaryTreeNode<TKey, TValue> node)
        {
            return new KeyValuePair<TKey, TValue>(node.Key, node.Value);
        }

        public static bool IsLeaf<TKey, TValue>(this IBinaryTreeNode<TKey, TValue> node)
        {
            return (node != null) && (node.Left == null) && (node.Right == null);
        }

        public static KeyValuePair<TKey, TValue>[] ToArray<TKey, TValue>(this IBinaryTreeNode<TKey, TValue> node)
        {
            var result = new List<KeyValuePair<TKey, TValue>>();
            InfixTraverse<IBinaryTreeNode<TKey, TValue>, TKey, TValue>(node, item => result.Add(item.ToKeyValue()));
            return result.ToArray();
        }

        public static void InfixTraverse<TNode, TKey, TValue>(TNode node, Action<TKey, TValue> action) where TNode : IBinaryTreeNode<TKey, TValue>
        {
            InfixTraverse<TNode, TKey, TValue>(node, item => action(item.Key, item.Value));
        }

        public static void InfixTraverse<TNode, TKey, TValue>(TNode node, Action<TNode> action) where TNode : IBinaryTreeNode<TKey, TValue>
        {
            if (node.Left != null)
            {
                InfixTraverse<TNode, TKey, TValue>((TNode)node.Left, action);
            }

            action(node);

            if (node.Right != null)
            {
                InfixTraverse<TNode, TKey, TValue>((TNode)node.Right, action);
            }
        }

        public static void PostfixTraverse<TNode, TKey, TValue>(TNode node, Action<TKey, TValue> action) where TNode : IBinaryTreeNode<TKey, TValue>
        {
            PostfixTraverse<TNode, TKey, TValue>(node, item => action(item.Key, item.Value));
        }

        public static void PostfixTraverse<TNode, TKey, TValue>(TNode node, Action<TNode> action) where TNode : IBinaryTreeNode<TKey, TValue>
        {
            if (node.Left != null)
            {
                PostfixTraverse<TNode, TKey, TValue>((TNode)node.Left, action);
            }

            if (node.Right != null)
            {
                PostfixTraverse<TNode, TKey, TValue>((TNode)node.Right, action);
            }

            action(node);
        }

        public static void PrefixTraverse<TNode, TKey, TValue>(TNode node, Action<TKey, TValue> action) where TNode : IBinaryTreeNode<TKey, TValue>
        {
            PrefixTraverse<TNode, TKey, TValue>(node, item => action(item.Key, item.Value));
        }

        public static void PrefixTraverse<TNode, TKey, TValue>(TNode node, Action<TNode> action) where TNode : IBinaryTreeNode<TKey, TValue>
        {
            action(node);

            if (node.Left != null)
            {
                PrefixTraverse<TNode, TKey, TValue>((TNode)node.Left, action);
            }

            if (node.Right != null)
            {
                PrefixTraverse<TNode, TKey, TValue>((TNode)node.Right, action);
            }
        }
    }
}