using System;
using System.Collections.Generic;

namespace WeAre.ReApptor.Toolkit.Collections.Trees
{
    /// <summary>
    /// AVL Tree (self-balancing binary search tree)
    /// </summary>
    /// <see cref="http://www.niisi.ru/iont/projects/rfbr/90308/90308_miphi6.php"/>
    /// <seealso cref="http://www.jurnal.org/articles/2008/inf26.html"/>
    /// <seealso cref="http://ru.wikipedia.org/wiki/%D0%90%D0%92%D0%9B-%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%BE"/>
    /// <seealso cref="http://eternallyconfuzzled.com/tuts/datastructures/jsw_tut_avl.aspx"/>
    public class AvlTree<TKey, TValue> : IBinaryTree<TKey, TValue>
    {
        #region Private
        
        #region Declarations
        
        private class Node : IBinaryTreeNode<TKey, TValue>
        {
            public TKey Key;
            public TValue Value;
            public Node Left;
            public Node Right;
            public Node Parent;
            public int Balance;
            public int BalanceD;

            private int CalculatedBalance => Right.TreeDepth() - Left.TreeDepth();

            public override string ToString()
            {
                return $"{Key}:{Balance}({CalculatedBalance})";
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
        private Node _root;
        private int? _depth;
        
        private static Node SmallLeftRotate(Node a)
        {
            Node parent = a.Parent;
            Node b = a.Right;
            Node c = b.Left;

            b.Parent = parent;
            a.Parent = b;
            a.Right = c;
            if (c != null)
            {
                c.Parent = a;
            }
            b.Left = a;

            if (b.Balance == 0)
            {
                a.Balance = +1;
                b.Balance = -1;
            }
            else
            {
                a.Balance = 0;
                b.Balance = 0;
            }

            return b;
        }

        private static Node BigLeftRotate(Node a)
        {
            Node parent = a.Parent;
            Node b = a.Right;
            Node c = b.Left;
            Node m = c.Left;
            Node n = c.Right;

            if (m != null)
            {
                m.Parent = a;
            }
            if (n != null)
            {
                n.Parent = b;
            }
            a.Parent = c;
            b.Parent = c;
            c.Parent = parent;

            a.Right = m;
            b.Left = n;
            c.Left = a;
            c.Right = b;

            if (c.Balance == 0)
            {
                a.Balance = 0;
                b.Balance = 0;
            }
            else if (c.Balance == +1)
            {
                a.Balance = -1;
                b.Balance = 0;
            }
            else
            {
                a.Balance = 0;
                b.Balance = +1;
            }

            c.Balance = 0;

            return c;
        }
        
        private static Node SmallRightRotate(Node a)
        {
            Node parent = a.Parent;
            Node b = a.Left;
            Node c = b.Right;

            b.Parent = parent;
            a.Parent = b;
            a.Left = c;
            if (c != null)
            {
                c.Parent = a;
            }
            b.Right = a;

            if (b.Balance == 0)
            {
                a.Balance = -1;
                b.Balance = +1;
            }
            else
            {
                a.Balance = 0;
                b.Balance = 0;
            }

            return b;
        }

        private static Node BigRightRotate(Node a)
        {
            Node parent = a.Parent;
            Node b = a.Left;
            Node c = b.Right;
            Node m = c.Left;
            Node n = c.Right;

            if (m != null)
            {
                m.Parent = b;
            }
            if (n != null)
            {
                n.Parent = a;
            }
            a.Parent = c;
            b.Parent = c;
            c.Parent = parent;

            b.Right = m;
            a.Left = n;
            c.Right = a;
            c.Left = b;

            if (c.Balance == 0)
            {
                a.Balance = 0;
                b.Balance = 0;
            }
            else if (c.Balance == +1)
            {
                a.Balance = 0;
                b.Balance = -1;
            }
            else
            {
                a.Balance = +1;
                b.Balance = 0;
            }

            c.Balance = 0;

            return c;
        }

        private void UpdateNode(Node parent, Node oldValue, Node newValue)
        {
            if (parent != null)
            {
                if (parent.Left == oldValue)
                {
                    parent.Left = newValue;
                }
                else
                {
                    parent.Right = newValue;
                }
            }
            else
            {
                _root = newValue;
            }
        }

        private Node RestoreBalance(Node node)
        {
            Node a;
            Node parent = node.Parent;
            //Restore balance
            if (node.Balance == -2)
            {
                int balance = node.Left.Balance;
                a = (balance == +1) ? BigRightRotate(node) : SmallRightRotate(node);
            }
            else //(node.Balance == +2)
            {
                int balance = node.Right.Balance;
                a = (balance == -1) ? BigLeftRotate(node) : SmallLeftRotate(node);
            }

            UpdateNode(parent, node, a);
            
            return a;
        }

        private bool UpdateBalance(Node node)
        {
            //Calc balance
            if (node.BalanceD > 0)
            {
                switch (node.Balance)
                {
                    case -1:
                        node.Balance = 0;
                        return true;
                    case 0:
                        node.Balance = +1;
                        return false;
                    case 1:
                        node.Balance = +2;
                        RestoreBalance(node);
                        return true;
                }
            }
            else //node.BalanceD < 0
            {
                switch (node.Balance)
                {
                    case -1:
                        node.Balance = -2;
                        RestoreBalance(node);
                        return true;
                    case 0:
                        node.Balance = -1;
                        return false;
                    case 1:
                        node.Balance = 0;
                        return true;
                }
            }

            return false;
        }

        private Node UpdateBalanceAfterDelete(Node node, out bool balanced)
        {
            balanced = false;
            //Calc balance
            if (node.BalanceD > 0)
            {
                switch (node.Balance)
                {
                    case -1:
                        node.Balance = 0;
                        break;
                    case 0:
                        node.Balance = +1;
                        balanced = true;
                        break;
                    case 1:
                        node.Balance = +2;
                        node = RestoreBalance(node);
                        balanced = (node.Balance == -1) || (node.Balance == +1);
                        break;
                }
            }
            else if (node.BalanceD < 0)
            {
                switch (node.Balance)
                {
                    case -1:
                        node.Balance = -2;
                        node = RestoreBalance(node);
                        balanced = (node.Balance == -1) || (node.Balance == +1);
                        break;
                    case 0:
                        node.Balance = -1;
                        balanced = true;
                        break;
                    case 1:
                        node.Balance = 0;
                        break;
                }
            }

            return node.Parent;
        }

        private static Node FindMax(Node node)
        {
            node.BalanceD = -1;
            
            while (node.Right != null)
            {
                node = node.Right;
                node.BalanceD = -1;
            }

            return node;
        }

        private static Node FindMin(Node node)
        {
            node.BalanceD = +1;
            
            while (node.Left != null)
            {
                node = node.Left;
                node.BalanceD = +1;
            }

            return node;
        }

        private Node RemoveElement(Node node)
        {
            Node parent;
            Node v;
            if (node.Balance >= 0) //Правое поддерево больше или равно левому
            {
                v = FindMin(node.Right);
                
                parent = (v.Parent != node) ? v.Parent : node;

                node.Key = v.Key;
                node.Value = v.Value;
                node.BalanceD = -1;

                UpdateNode(v.Parent, v, v.Right);
                
                if (v.Right != null)
                {
                    v.Right.Parent = v.Parent;
                }
                v.Parent = null;
            }
            else //Левое поддерево больше
            {
                v = FindMax(node.Left);
                
                parent = (v.Parent != node) ? v.Parent : node;

                node.Key = v.Key;
                node.Value = v.Value;
                node.BalanceD = +1;

                UpdateNode(v.Parent, v, v.Left);
                
                if (v.Left != null)
                {
                    v.Left.Parent = v.Parent;
                }
                v.Parent = null;
            }

            return parent;
        }
        
        #endregion
        
        #region Public
        
        #region Methods
        
        public AvlTree(IComparer<TKey> comparer = null)
        {
            _comparer = comparer ?? Comparer<TKey>.Default;
        }

        public TValue Remove(TKey key)
        {
            if (_keys.Contains(key))
            {
                Node node = _root;
                do
                {
                    int c = _comparer.Compare(key, node.Key);
                    if (c < 0)
                    {
                        node.BalanceD = +1;
                        node = node.Left;
                    }
                    else if (c > 0)
                    {
                        node.BalanceD = -1;
                        node = node.Right;
                    }
                    else
                    {
                        TValue value = node.Value;
                        bool isLeftNull = node.Left == null;
                        bool isRightNull = node.Right == null;

                        Node parent = node.Parent;
                        if ((isLeftNull) || (isRightNull))
                        {
                            if ((isLeftNull) && (isRightNull))
                            {
                                UpdateNode(parent, node, null);
                            }
                            else if (isLeftNull)
                            {
                                node.Right.Parent = parent;
                                UpdateNode(parent, node, node.Right);
                            }
                            else
                            {
                                node.Left.Parent = parent;
                                UpdateNode(parent, node, node.Left);
                            }
                        }
                        else
                        {
                            parent = RemoveElement(node);
                        }

                        while (parent != null)
                        {
                            parent = UpdateBalanceAfterDelete(parent, out bool balanced);
                            if (balanced)
                            {
                                break;
                            }
                        }
                        
                        _depth = null;
                        _keys.Remove(key);

                        return value;
                    }
                } while (true);
            }

            return default;
        }

        public TValue BinarySearch(TKey key)
        {
            return (_keys.Contains(key))
                ? _root.BinarySearch(key, _comparer)
                : default;
        }

        public bool Add(TKey key, TValue value)
        {
            if (_keys.Contains(key))
            {
                return false;
            }

            _keys.Add(key);
            _depth = null;

            var newNode = new Node {Key = key, Value = value};
            Node node = _root;
            if (node == null)
            {
                _root = newNode;
                return true;
            }

            do
            {
                int c = _comparer.Compare(key, node.Key);
                if (c < 0)
                {
                    node.BalanceD = -1;
                    if (node.Left == null)
                    {
                        node.Left = newNode;
                        newNode.Parent = node;

                        do
                        {
                            if (UpdateBalance(node)) break;
                            node = node.Parent;
                        } while (node != null);

                        return true;
                    }

                    node = node.Left;
                }
                else
                {
                    node.BalanceD = +1;
                    if (node.Right == null)
                    {
                        node.Right = newNode;
                        newNode.Parent = node;

                        do
                        {
                            if (UpdateBalance(node)) break;
                            node = node.Parent;
                        } while (node != null);

                        return true;
                    }

                    node = node.Right;
                }
            } while (true);
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

        public void Clear()
        {
            if (_root != null)
            {
                _root = null;
                _depth = null;
                _keys.Clear();
            }
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
                int leftDepth = item.Left.TreeDepth();
                int rightDepth = item.Right.TreeDepth();
                int balance = item.Balance;
                int calculatedBalance = rightDepth - leftDepth;
                bool correctLeftParent = (item.Left == null) || ((item.Left.Parent == item));
                bool correctRightParent = (item.Right == null) || ((item.Right.Parent == item));
                if ((!correctLeftParent) || (!correctRightParent))
                {
                    balanced = false;
                }

                if (Math.Abs(calculatedBalance) > 1)
                {
                    balanced = false;
                }

                if (balance != calculatedBalance)
                {
                    balanced = false;
                }
            });
            
            return balanced;
        }

        public static void Sort<T>(T[] items, Comparer<T> comparer = null)
        {
            var tree = new AvlTree<T, int>(comparer);
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