using System;
using System.Collections.Generic;

namespace Renta.Toolkit.Collections.Trees
{
    /// <summary>
    /// Red-Black Tree (self-balancing binary search tree)
    /// </summary>
    /// <see cref="http://en.wikipedia.org/wiki/Red%E2%80%93black_tree"/>
    public class RedBlackTree<TKey, TValue> : IBinaryTree<TKey, TValue>
    {
        #region Private
        
        #region Declarations
        
        private enum TreeRotation
        {
            LeftRightRotation = 4,
            LeftRotation = 1,
            RightLeftRotation = 3,
            RightRotation = 2
        }

        private class Node : IBinaryTreeNode<TKey, TValue>
        {
            public bool IsRed;
            public readonly TKey Key;
            public TValue Value;
            public Node Left;
            public Node Right;

            public Node(TKey key, TValue value, bool isRed = true)
            {
                Key = key;
                Value = value;
                IsRed = isRed;
            }

            #region IBinaryTreeNode

            IBinaryTreeNode<TKey, TValue> IBinaryTreeNode<TKey, TValue>.Left => Left;

            IBinaryTreeNode<TKey, TValue> IBinaryTreeNode<TKey, TValue>.Right => Right;

            TKey IBinaryTreeNode<TKey, TValue>.Key => Key;

            TValue IBinaryTreeNode<TKey, TValue>.Value
            {
                get => Value;
                set => Value = value;
            }

            #endregion
        }
        
        #endregion
 
        private readonly HashSet<TKey> _keys = new HashSet<TKey>();
        private readonly IComparer<TKey> _comparer;
        private int? _depth;
        private Node _root;

        private static Node GetSibling(Node node, Node parent)
        {
            if (parent.Left == node)
            {
                return parent.Right;
            }
            return parent.Left;
        }
        
        private void InsertionBalance(Node current, ref Node parent, Node grandParent, Node greatGrandParent)
        {
            Node node;
            bool flag = grandParent.Right == parent;
            bool flag2 = parent.Right == current;
            if (flag == flag2)
            {
                node = flag2 ? RotateLeft(grandParent) : RotateRight(grandParent);
            }
            else
            {
                node = flag2 ? RotateLeftRight(grandParent) : RotateRightLeft(grandParent);
                parent = greatGrandParent;
            }
            grandParent.IsRed = true;
            node.IsRed = false;
            ReplaceChildOfNodeOrRoot(greatGrandParent, grandParent, node);
        }

        private static bool Is2Node(Node node)
        {
            return ((IsBlack(node) && IsNullOrBlack(node.Left)) && IsNullOrBlack(node.Right));
        }

        private static bool Is4Node(Node node)
        {
            return (IsRedNode(node.Left) && IsRedNode(node.Right));
        }

        private static bool IsBlack(Node node)
        {
            return ((node != null) && !node.IsRed);
        }

        private static bool IsNullOrBlack(Node node)
        {
            if (node != null)
            {
                return !node.IsRed;
            }
            return true;
        }

        private static bool IsRedNode(Node node)
        {
            return ((node != null) && (node.IsRed));
        }

        private static void Merge2Nodes(Node parent, Node child1, Node child2)
        {
            parent.IsRed = false;
            child1.IsRed = true;
            child2.IsRed = true;
        }

        private void ReplaceChildOfNodeOrRoot(Node parent, Node child, Node newChild)
        {
            if (parent != null)
            {
                if (parent.Left == child)
                {
                    parent.Left = newChild;
                }
                else
                {
                    parent.Right = newChild;
                }
            }
            else
            {
                _root = newChild;
            }
        }

        private void ReplaceNode(Node match, Node parentOfMatch, Node succesor, Node parentOfSuccesor)
        {
            if (succesor == match)
            {
                succesor = match.Left;
            }
            else
            {
                if (succesor.Right != null)
                {
                    succesor.Right.IsRed = false;
                }
                if (parentOfSuccesor != match)
                {
                    parentOfSuccesor.Left = succesor.Right;
                    succesor.Right = match.Right;
                }
                succesor.Left = match.Left;
            }

            if (succesor != null)
            {
                succesor.IsRed = match.IsRed;
            }

            ReplaceChildOfNodeOrRoot(parentOfMatch, match, succesor);
        }

        private static Node RotateLeft(Node node)
        {
            Node right = node.Right;
            node.Right = right.Left;
            right.Left = node;
            return right;
        }

        private static Node RotateLeftRight(Node node)
        {
            Node left = node.Left;
            Node right = left.Right;
            node.Left = right.Right;
            right.Right = node;
            left.Right = right.Left;
            right.Left = left;
            return right;
        }

        private static Node RotateRight(Node node)
        {
            Node left = node.Left;
            node.Left = left.Right;
            left.Right = node;
            return left;
        }

        private static Node RotateRightLeft(Node node)
        {
            Node right = node.Right;
            Node left = right.Left;
            node.Right = left.Left;
            left.Left = node;
            right.Left = left.Right;
            left.Right = right;
            return left;
        }

        private static TreeRotation RotationNeeded(Node parent, Node current, Node sibling)
        {
            if (IsRedNode(sibling.Left))
            {
                if (parent.Left == current)
                {
                    return TreeRotation.RightLeftRotation;
                }
                
                return TreeRotation.RightRotation;
            }
            
            if (parent.Left == current)
            {
                return TreeRotation.LeftRotation;
            }
            
            return TreeRotation.LeftRightRotation;
        }

        private static void Split4Node(Node node)
        {
            node.IsRed = true;
            node.Left.IsRed = false;
            node.Right.IsRed = false;
        }
        
        #endregion
        
        #region Public
        
        #region Methods
        
        public RedBlackTree(IComparer<TKey> comparer = null)
        {
            _comparer = comparer ?? Comparer<TKey>.Default;
        }

        public bool Add(TKey key, TValue value)
        {
            if (_keys.Contains(key))
            {
                return false;
            }

            _keys.Add(key);
            _depth = null;

            if (_root == null)
            {
                _root = new Node(key, value, false);
            }
            else
            {
                Node root = _root;
                Node node = null;
                Node grandParent = null;
                Node greatGrandParent = null;
                int num = 0;
                while (root != null)
                {
                    num = _comparer.Compare(key, root.Key);
                    if (num == 0)
                    {
                        _root.IsRed = false;
                        return false;
                        //throw new ArgumentOutOfRangeException(nameof(key), "Argument_AddingDuplicate");
                    }
                    if (Is4Node(root))
                    {
                        Split4Node(root);
                        if (IsRedNode(node))
                        {
                            InsertionBalance(root, ref node, grandParent, greatGrandParent);
                        }
                    }
                    greatGrandParent = grandParent;
                    grandParent = node;
                    node = root;
                    root = (num < 0) ? root.Left : root.Right;
                }

                if (node != null)
                {
                    var current = new Node(key, value);
                    if (num > 0)
                    {
                        node.Right = current;
                    }
                    else
                    {
                        node.Left = current;
                    }

                    if (node.IsRed)
                    {
                        InsertionBalance(current, ref node, grandParent, greatGrandParent);
                    }
                }

                _root.IsRed = false;
            }

            return true;
        }

        public void Clear()
        {
            _root = null;
            _depth = null;
            _keys.Clear();
        }

        public bool Contains(TKey key)
        {
            return _keys.Contains(key);
        }

        public IBinaryTreeNode<TKey, TValue> FindNode(TKey key)
        {
            return (_keys.Contains(key))
                ? _root.FindNode(key, _comparer)
                : null;
        }

        public TValue BinarySearch(TKey key)
        {
            return (_keys.Contains(key))
                ? _root.BinarySearch(key, _comparer)
                : default;
        }
        
        public TValue Remove(TKey key)
        {
            if ((_root == null) || (_keys.Contains(key)))
            {
                return default;
            }
            
            Node root = _root;
            Node parent = null;
            Node node3 = null;
            Node match = null;
            Node parentOfMatch = null;
            bool flag = false;
            TValue v = default;
            
            while (root != null)
            {
                if (Is2Node(root))
                {
                    if (parent == null)
                    {
                        root.IsRed = true;
                    }
                    else
                    {
                        Node sibling = GetSibling(root, parent);
                        if (sibling.IsRed)
                        {
                            if (parent.Right == sibling)
                            {
                                RotateLeft(parent);
                            }
                            else
                            {
                                RotateRight(parent);
                            }
                            parent.IsRed = true;
                            sibling.IsRed = false;
                            ReplaceChildOfNodeOrRoot(node3, parent, sibling);
                            node3 = sibling;
                            if (parent == match)
                            {
                                parentOfMatch = sibling;
                            }
                            sibling = (parent.Left == root) ? parent.Right : parent.Left;
                        }
                        if (Is2Node(sibling))
                        {
                            Merge2Nodes(parent, root, sibling);
                        }
                        else
                        {
                            TreeRotation rotation = RotationNeeded(parent, root, sibling);
                            Node newChild = null;
                            switch (rotation)
                            {
                                case TreeRotation.LeftRotation:
                                    sibling.Right.IsRed = false;
                                    newChild = RotateLeft(parent);
                                    break;

                                case TreeRotation.RightRotation:
                                    sibling.Left.IsRed = false;
                                    newChild = RotateRight(parent);
                                    break;

                                case TreeRotation.RightLeftRotation:
                                    newChild = RotateRightLeft(parent);
                                    break;

                                case TreeRotation.LeftRightRotation:
                                    newChild = RotateLeftRight(parent);
                                    break;
                            }
                            // ReSharper disable once PossibleNullReferenceException
                            newChild.IsRed = parent.IsRed;
                            parent.IsRed = false;
                            root.IsRed = true;
                            ReplaceChildOfNodeOrRoot(node3, parent, newChild);
                            if (parent == match)
                            {
                                parentOfMatch = newChild;
                            }
                            //node3 = newChild;
                        }
                    }
                }
                int num = flag ? -1 : _comparer.Compare(key, root.Key);
                if (num == 0)
                {
                    flag = true;
                    match = root;
                    parentOfMatch = parent;
                    v = match.Value;
                }
                node3 = parent;
                parent = root;
                root = num < 0 ? root.Left : root.Right;
            }
            
            if (match != null)
            {
                ReplaceNode(match, parentOfMatch, parent, node3);
            }
            
            if (_root != null)
            {
                _root.IsRed = false;
            }

            _depth = null;
            
            return v;
        }

        /// <summary>
        /// INFIX_TRAVERSE ( f ) — обойти всё дерево, следуя порядку (левое поддерево, вершина, правое поддерево).
        /// </summary>
        public void InfixTraverse(Action<TKey, TValue> action)
        {
            if ((_root != null) && (action != null))
            {
                BinaryTreeHelper.InfixTraverse(_root, action);
            }
        }

        /// <summary>
        /// PREFIX_TRAVERSE ( f ) — обойти всё дерево, следуя порядку (вершина, левое поддерево, правое поддерево).
        /// </summary>
        public void PrefixTraverse(Action<TKey, TValue> action)
        {
            if ((_root != null) && (action != null))
            {
                BinaryTreeHelper.PrefixTraverse(_root, action);
            }
        }

        /// <summary>
        /// POSTFIX_TRAVERSE ( f ) — обойти всё дерево, следуя порядку (левое поддерево, правое поддерево, вершина).
        /// </summary>
        public void PostfixTraverse(Action<TKey, TValue> action)
        {
            if ((_root != null) && (action != null))
            {
                BinaryTreeHelper.PostfixTraverse(_root, action);
            }
        }

        public KeyValuePair<TKey, TValue>[] ToArray()
        {
            return (_root != null)
                ? _root.ToArray()
                : new KeyValuePair<TKey, TValue>[0];
        }

        public bool CheckBalance()
        {
            if (_root == null)
            {
                return true;
            }
            
            bool balanced = true;

            BinaryTreeHelper.InfixTraverse<Node, TKey, TValue>(_root, item =>
            {
                int leftDepth = item.Left.TreeDepth() + 1;
                int rightDepth = item.Right.TreeDepth() + 1;

                double balance = (leftDepth > rightDepth)
                    ? (double) leftDepth / rightDepth
                    : (double) rightDepth / leftDepth;
                    
                if (balance > 2.0)
                {
                    balanced = false;
                }
            });

            return balanced;
        }

        public static void Sort<T>(T[] items, Comparer<T> comparer = null)
        {
            var tree = new RedBlackTree<T, int>(comparer);
            tree.Sort(items);
        }

        #endregion
        
        #region Properties
        
        public IComparer<TKey> Comparer => _comparer;
        
        public IBinaryTreeNode<TKey, TValue> Root => _root;

        public int Count => _keys.Count;

        public int Depth => _depth ?? (_depth = _root.TreeDepth()).Value;
        
        #endregion
        
        #endregion
    }
}