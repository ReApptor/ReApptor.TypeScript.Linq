using System;
using System.Collections.Generic;
using Renta.Toolkit.Collections.Trees;
using Xunit;

namespace Renta.Toolkit.UnitTest.Collections.Trees
{
    public abstract class BaseTreeTest
    {
        #region Protected
        
        protected sealed class Value : IComparer<Value>
        {
            public long Key { get; }

            public Value(long key = 0)
            {
                Key = key;
            }

            public int Compare(Value x, Value y)
            {
                if (ReferenceEquals(x, y))
                {
                    return 0;
                }

                if (ReferenceEquals(x, null))
                {
                    return -1;
                }

                if (ReferenceEquals(y, null))
                {
                    return -1;
                }
                
                return x.Key.CompareTo(y.Key);
            }
            
            public static readonly IComparer<Value> Comparer = new Value();
        }

        protected abstract IBinaryTree<long, Value> Create();
        
        protected abstract void Sort<T>(T[] items);
        
        protected static readonly Random Rnd = new Random(DateTime.Now.Millisecond + DateTime.Now.Second);

        protected static List<long> GetUniqueIds(int count, int maxValue = int.MaxValue, Random rnd = null)
        {
            rnd ??= Rnd;
            maxValue = Math.Max(maxValue, count);

            var uniqueIds = new List<long>();
            var uniqueIdsHashSet = new HashSet<long>();
            for (int i = 0; i < count; i++)
            {
                long id;
                do
                {
                    id = rnd.Next(maxValue);
                } while (uniqueIdsHashSet.Contains(id));

                uniqueIdsHashSet.Add(id);
                uniqueIds.Add(id);
            }
            
            return uniqueIds;
        }
        
        protected static List<long> GetUniqueIds(int count, Random rnd)
        {
            return GetUniqueIds(count, int.MaxValue, rnd);
        }

        protected static List<long> GetSortedUniqueIds(int count, int maxValue = int.MaxValue)
        {
            var sortedUniqueIds = GetUniqueIds(count, maxValue);
            sortedUniqueIds.Sort();
            return sortedUniqueIds;
        }

        protected static List<long> GetSortedUniqueIdsDesc(int count)
        {
            var sortedUniqueIds = GetUniqueIds(count);
            sortedUniqueIds.Sort((x, y) => y.CompareTo(x));
            return sortedUniqueIds;
        }

        protected static void Verify(IBinaryTree<long, Value> tree)
        {
            bool isBalanced = tree.CheckBalance();
            Assert.True(isBalanced);
        }

        protected static void AreEqual(List<Value> expect, IBinaryTree<long, Value> actual)
        {
            Assert.NotNull(expect);
            Assert.NotNull(actual);
            Assert.Equal(expect.Count, actual.Count);

            KeyValuePair<long, Value>[] actualData = actual.ToArray();
            
            Assert.Equal(expect.Count, actualData.Length);
            
            expect.Sort(Value.Comparer);
            for (var i = 0; i < expect.Count; i++)
            {
                Assert.Equal(expect[i].Key, actualData[i].Key);
                Assert.Equal(expect[i].Key, actualData[i].Value.Key);
            }
        }
        
        #endregion

        [Fact]
        public void AddTest()
        {
            const int count = 5000;
            var list1 = new List<Value>();
            IBinaryTree<long, Value> list2 = Create();

            List<long> uniqueIds = GetUniqueIds(count);

            for (int i = 0; i < count; i++)
            {
                long id = uniqueIds[i];
                var message = new Value(id);

                list1.Add(message);

                bool r = list2.Add(id, message);
                bool c = list2.Contains(id);

                Assert.True(r);
                Assert.True(c);

                Verify(list2);
            }

            AreEqual(list1, list2);
        }

        [Fact]
        public void AddNormalTest()
        {
            const int count = 5000;
            var list1 = new List<Value>();
            IBinaryTree<long, Value> list2 = Create();

            List<long> uniqueIds = GetUniqueIds(count, Rnd);

            for (int i = 0; i < count; i++)
            {
                long id = uniqueIds[i];
                var message = new Value(id);

                list1.Add(message);

                bool r = list2.Add(id, message);
                bool c = list2.Contains(id);

                Assert.True(r);
                Assert.True(c);

                Verify(list2);
            }

            AreEqual(list1, list2);
        }

        [Fact]
        public void AscSequenceTest()
        {
            const int max = 5000;
            var list1 = new List<Value>();
            IBinaryTree<long, Value> list2 = Create();

            for (int i = 0; i <= max; i++)
            {
                long id = i;
                var message = new Value(id);

                list1.Add(message);

                bool r = list2.Add(id, message);
                bool c = list2.Contains(id);

                Assert.True(r);
                Assert.True(c);

                Verify(list2);
            }

            AreEqual(list1, list2);
        }

        [Fact]
        public void DescSequenceTest()
        {
            const int max = 5000;
            var list1 = new List<Value>();
            IBinaryTree<long, Value> list2 = Create();

            for (int i = 0; i <= max; i++)
            {
                long id = 5000 - i;
                var message = new Value(id);

                list1.Add(message);

                bool r = list2.Add(id, message);
                bool c = list2.Contains(id);

                Assert.True(r);
                Assert.True(c);

                Verify(list2);
            }

            AreEqual(list1, list2);
        }

        [Fact]
        public void SimpleAddTest()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(4, new Value(4));
            Verify(tree);
            tree.Add(5, new Value(5));
            Verify(tree);
            tree.Add(7, new Value(7));
            Verify(tree);
            tree.Add(2, new Value(2));
            Verify(tree);
            tree.Add(1, new Value(1));
            Verify(tree);
            tree.Add(3, new Value(3));
            Verify(tree);
            tree.Add(6, new Value(6));
            Verify(tree);
        }

        [Fact]
        public void SimpleAddTest2()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(27, new Value(27));
            Verify(tree);
            tree.Add(905, new Value(905));
            Verify(tree);
            tree.Add(974, new Value(974));
            Verify(tree);
            tree.Add(28, new Value(28));
            Verify(tree);
            tree.Add(867, new Value(867));
            Verify(tree);
            tree.Add(210, new Value(210));
            Verify(tree);
            tree.Add(540, new Value(540));
            Verify(tree);
            tree.Add(429, new Value(429));
            Verify(tree);
        }

        [Fact]
        public void SimpleAddTest3()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(872, new Value(872));
            Verify(tree);
            tree.Add(78, new Value(78));
            Verify(tree);
            tree.Add(39, new Value(39));
            Verify(tree);
            tree.Add(237, new Value(237));
            Verify(tree);
            tree.Add(275, new Value(275));
            Verify(tree);
            tree.Add(765, new Value(765));
            Verify(tree);
            tree.Add(506, new Value(506));
            Verify(tree);
            tree.Add(654, new Value(654));
            Verify(tree);
            tree.Add(53, new Value(53));
            Verify(tree);
            tree.Add(774, new Value(774));
            Verify(tree);
        }

        [Fact]
        public void SimpleAddTest4()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(175, new Value(175));
            Verify(tree);
            tree.Add(756, new Value(756));
            Verify(tree);
            tree.Add(412, new Value(412));
            Verify(tree);
            tree.Add(917, new Value(917));
            Verify(tree);
            tree.Add(711, new Value(711));
            Verify(tree);
        }

        [Fact]
        public void AddTest_SortedItems()
        {
            const int count = 5000;
            var list1 = new List<Value>();
            var list2 = new AvlTree<long, Value>();

            List<long> uniqueIds = GetSortedUniqueIds(count);

            for (int i = 0; i < count; i++)
            {
                long id = uniqueIds[i];
                var message = new Value(id);

                list1.Add(message);
                bool r = list2.Add(id, message);
                bool c = list2.Contains(id);

                Assert.True(r);
                Assert.True(c);

                Verify(list2);
            }

            AreEqual(list1, list2);
        }

        [Fact]
        public void AddTest_SortedDescItems()
        {
            const int count = 5000;
            var list1 = new List<Value>();
            var list2 = new AvlTree<long, Value>();

            List<long> uniqueIds = GetSortedUniqueIdsDesc(count);

            for (int i = 0; i < count; i++)
            {
                long id = uniqueIds[i];
                var message = new Value(id);

                list1.Add(message);
                bool r = list2.Add(id, message);
                bool c = list2.Contains(id);

                Assert.True(r);
                Assert.True(c);

                Verify(list2);
            }

            AreEqual(list1, list2);
        }

        [Fact]
        public void SimpleRemoveTest()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(4, new Value(4));
            Verify(tree);
            tree.Add(5, new Value(5));
            Verify(tree);
            tree.Add(7, new Value(7));
            Verify(tree);
            tree.Add(2, new Value(2));
            Verify(tree);
            tree.Add(1, new Value(1));
            Verify(tree);
            tree.Add(3, new Value(3));
            Verify(tree);
            tree.Add(6, new Value(6));
            Verify(tree);

            tree.Remove(1);
            Verify(tree);
            tree.Remove(3);
            Verify(tree);
            tree.Remove(2);
            Verify(tree);
            tree.Remove(4);
            Verify(tree);
            tree.Remove(7);
            Verify(tree);
            tree.Remove(6);
            Verify(tree);
            tree.Remove(5);
            Verify(tree);
        }

        [Fact]
        public void SimpleRemoveTest2()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(4, new Value(4));
            Verify(tree);
            tree.Add(5, new Value(5));
            Verify(tree);
            tree.Add(7, new Value(7));
            Verify(tree);
            tree.Add(2, new Value(2));
            Verify(tree);
            tree.Add(1, new Value(1));
            Verify(tree);
            tree.Add(3, new Value(3));
            Verify(tree);
            tree.Add(6, new Value(6));
            Verify(tree);

            tree.Remove(2);
            Verify(tree);
            tree.Remove(6);
            Verify(tree);
        }

        [Fact]
        public void SimpleRemoveTest3()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(4, new Value(4));
            Verify(tree);
            tree.Add(5, new Value(5));
            Verify(tree);
            tree.Add(7, new Value(7));
            Verify(tree);
            tree.Add(2, new Value(2));
            Verify(tree);
            tree.Add(1, new Value(1));
            Verify(tree);
            tree.Add(3, new Value(3));
            Verify(tree);
            tree.Add(6, new Value(6));
            Verify(tree);
            tree.Add(8, new Value(8));
            Verify(tree);

            tree.Remove(6);
            Verify(tree);
        }

        [Fact]
        public void SimpleRemoveTest4()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(40, new Value(40));
            Verify(tree);
            tree.Add(50, new Value(50));
            Verify(tree);
            tree.Add(70, new Value(70));
            Verify(tree);
            tree.Add(20, new Value(20));
            Verify(tree);
            tree.Add(10, new Value(10));
            Verify(tree);
            tree.Add(30, new Value(30));
            Verify(tree);
            tree.Add(60, new Value(60));
            Verify(tree);
            tree.Add(80, new Value(80));
            Verify(tree);
            tree.Add(75, new Value(75));
            Verify(tree);

            tree.Remove(60);
            Verify(tree);
        }

        [Fact]
        public void SimpleRemoveTest5()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(40, new Value(40));
            Verify(tree);
            tree.Add(50, new Value(50));
            Verify(tree);
            tree.Add(70, new Value(70));
            Verify(tree);
            tree.Add(20, new Value(20));
            Verify(tree);
            tree.Add(10, new Value(10));
            Verify(tree);
            tree.Add(30, new Value(30));
            Verify(tree);
            tree.Add(60, new Value(60));
            Verify(tree);
            tree.Add(80, new Value(80));
            Verify(tree);
            tree.Add(75, new Value(75));
            Verify(tree);
            tree.Add(25, new Value(25));
            Verify(tree);

            tree.Remove(20);
            Verify(tree);
        }

        [Fact]
        public void SimpleRemoveTest6()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(40, new Value(40));
            Verify(tree);
            tree.Add(50, new Value(50));
            Verify(tree);
            tree.Add(70, new Value(70));
            Verify(tree);
            tree.Add(20, new Value(20));
            Verify(tree);
            tree.Add(10, new Value(10));
            Verify(tree);
            tree.Add(30, new Value(30));
            Verify(tree);
            tree.Add(60, new Value(60));
            Verify(tree);
            tree.Add(80, new Value(80));
            Verify(tree);
            tree.Add(75, new Value(75));
            Verify(tree);
            tree.Add(5, new Value(25));
            Verify(tree);

            tree.Remove(20);
            Verify(tree);
        }

        [Fact]
        public void SimpleRemoveTest7()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(40, new Value(40));
            Verify(tree);
            tree.Add(50, new Value(50));
            Verify(tree);
            tree.Add(70, new Value(70));
            Verify(tree);
            tree.Add(20, new Value(20));
            Verify(tree);
            tree.Add(10, new Value(10));
            Verify(tree);
            tree.Add(30, new Value(30));
            Verify(tree);
            tree.Add(60, new Value(60));
            Verify(tree);
            tree.Add(80, new Value(80));
            Verify(tree);
            tree.Add(75, new Value(75));
            Verify(tree);
            tree.Add(5, new Value(5));
            Verify(tree);
            tree.Add(15, new Value(15));
            Verify(tree);

            tree.Remove(20);
            Verify(tree);
        }

        [Fact]
        public void SimpleRemoveTest8()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(5, new Value(5));
            Verify(tree);
            tree.Add(3, new Value(3));
            Verify(tree);
            tree.Add(8, new Value(8));
            Verify(tree);
            tree.Add(2, new Value(2));
            Verify(tree);
            tree.Add(4, new Value(4));
            Verify(tree);
            tree.Add(7, new Value(7));
            Verify(tree);
            tree.Add(10, new Value(10));
            Verify(tree);
            tree.Add(1, new Value(1));
            Verify(tree);
            tree.Add(6, new Value(6));
            Verify(tree);
            tree.Add(9, new Value(9));
            Verify(tree);
            tree.Add(11, new Value(11));
            Verify(tree);

            tree.Remove(4);
            Verify(tree);
            tree.Remove(8);
            Verify(tree);
            tree.Remove(6);
            Verify(tree);
            tree.Remove(5);
            Verify(tree);
            tree.Remove(2);
            Verify(tree);
            tree.Remove(1);
            Verify(tree);
            tree.Remove(7);
            Verify(tree);
        }

        [Fact]
        public void SimpleRemoveTest9()
        {
            var list1 = new List<Value>
                            {
                                {new Value(10)},
                                {new Value(1)},
                                {new Value(20)},
                                {new Value(5)},
                                {new Value(7)},
                                {new Value(2)},
                                {new Value(99)}
                            };
            var list2 = new AvlTree<long, Value>();

            int count = list1.Count;

            for (int i = 0; i < count; i++)
            {
                list2.Add(list1[i].Key, list1[i]);
            }

            Verify(list2);
            
            Value item = list1[5];
            list1.Remove(item);
            list2.Remove(item.Key);
            AreEqual(list1, list2);
            Verify(list2);

            item = list1[3];
            list1.Remove(item);
            list2.Remove(item.Key);
            AreEqual(list1, list2);
            Verify(list2);

            item = list1[0];
            list1.Remove(item);
            list2.Remove(item.Key);
            AreEqual(list1, list2);
            Verify(list2);

            item = list1[2];
            list1.Remove(item);
            list2.Remove(item.Key);
            AreEqual(list1, list2);
            Verify(list2);

            item = list1[1];
            list1.Remove(item);
            list2.Remove(item.Key);
            AreEqual(list1, list2);
            Verify(list2);

            item = list1[0];
            list1.Remove(item);
            list2.Remove(item.Key);
            AreEqual(list1, list2);
            Verify(list2);
        }

        [Fact]
        public void SimpleRemoveTest10()
        {
            var list1 = new List<Value>
                            {
                                new Value(5),
                                new Value(1),
                                new Value(2),
                                new Value(3),
                                new Value(4),
                            };
            var list2 = new AvlTree<long, Value>();

            int count = list1.Count;

            for (int i = 0; i < count; i++)
            {
                list2.Add(list1[i].Key, list1[i]);
                Verify(list2);
            }

            AreEqual(list1, list2);

            Value item = list1[1];
            list1.Remove(item);
            list2.Remove(item.Key);
            AreEqual(list1, list2);
            Verify(list2);
        }

        [Fact]
        public void SimpleRemoveTest11()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(3, new Value(3));
            Verify(tree);
            tree.Add(33, new Value(33));
            Verify(tree);
            tree.Add(38, new Value(38));
            Verify(tree);
            tree.Add(75, new Value(75));
            Verify(tree);
            tree.Add(20, new Value(20));
            Verify(tree);
            tree.Add(80, new Value(80));
            Verify(tree);
            tree.Add(74, new Value(74));
            Verify(tree);
            tree.Add(48, new Value(48));
            Verify(tree);
            tree.Add(94, new Value(94));
            Verify(tree);
            tree.Add(4, new Value(4));
            Verify(tree);

            tree.Remove(20);
            Verify(tree);
            tree.Remove(33);
            Verify(tree);
        }

        [Fact]
        public void SimpleRemoveTest12()
        {
            var tree = new AvlTree<long, Value>();
            tree.Add(32, new Value(32));
            tree.Add(74, new Value(74));
            tree.Add(10, new Value(10));
            tree.Add(61, new Value(61));
            tree.Add(19, new Value(19));
            tree.Add(3, new Value(3));
            tree.Add(65, new Value(65));
            tree.Add(55, new Value(55));
            tree.Add(63, new Value(63));
            tree.Add(39, new Value(39));

            tree.Remove(61);
            Verify(tree);
            tree.Remove(74);
            Verify(tree);
            tree.Remove(10);
            Verify(tree);
            tree.Remove(19);
            Verify(tree);
        }

        [Fact]
        public void RemoveTest()
        {
            const int count = 5000;
            var list1 = new List<Value>();
            var list2 = new AvlTree<long, Value>();

            var uniqueIds = GetUniqueIds(count);

            for (int i = 0; i < count; i++)
            {
                long id = uniqueIds[i];
                var message = new Value(id);
                list1.Add(message);
                list2.Add(id, message);
            }
            Verify(list2);

            AreEqual(list1, list2);

            for (int i = 0; i < count; i++)
            {
                int index = Rnd.Next(list1.Count - 1);
                Value item = list1[index];
                long id = item.Key;
                bool c = list2.Contains(id);
                Assert.True(c);
                
                list1.Remove(item);
                Value r = list2.Remove(id);
                c = list2.Contains(id);

                Assert.False(c);
                Assert.True(r != null);
                Assert.Equal(r, item);

                Verify(list2);
            }

            AreEqual(list1, list2);
            Verify(list2);
        }

        [Fact]
        public void RemoveTest_InTheSameOrder()
        {
            const int count = 5000;
            var list1 = new List<Value>();
            var list2 = new AvlTree<long, Value>();

            var uniqueIds = GetUniqueIds(count);

            for (int i = 0; i < count; i++)
            {
                long id = uniqueIds[i];
                var message = new Value(id);
                list1.Add(message);
                list2.Add(id, message);
            }
            Verify(list2);

            AreEqual(list1, list2);

            for (int i = 0; i < count; i++)
            {
                Value item = list1[0];
                long id = item.Key;
                bool c = list2.Contains(id);
                Assert.True(c);

                list1.Remove(item);
                Value r = list2.Remove(id);
                c = list2.Contains(id);

                Assert.False(c);
                Assert.True(r != null);
                Assert.Equal(r, item);

                Verify(list2);
            }

            AreEqual(list1, list2);
            Verify(list2);
        }

        [Fact]
        public void RemoveTest_InTheBackOrder()
        {
            const int count = 5000;
            var list1 = new List<Value>();
            var list2 = new AvlTree<long, Value>();

            var uniqueIds = GetUniqueIds(count);

            for (int i = 0; i < count; i++)
            {
                long id = uniqueIds[i];
                Value message = new Value(id);
                list1.Add(message);
                list2.Add(id, message);
            }
            
            Verify(list2);

            AreEqual(list1, list2);

            for (int i = 0; i < count; i++)
            {
                Value item = list1[list1.Count - 1];
                long id = item.Key;
                bool c = list2.Contains(id);
                Assert.True(c);

                list1.Remove(item);
                Value r = list2.Remove(id);
                c = list2.Contains(id);

                Assert.False(c);
                Assert.True(r != null);
                Assert.Equal(r, item);

                Verify(list2);
            }

            AreEqual(list1, list2);
            Verify(list2);
        }

        [Fact]
        public void RemoveTest_SortedItems()
        {
            const int count = 5000;
            var list1 = new List<Value>(2 * count);
            var list2 = new AvlTree<long, Value>();

            var uniqueIds = GetSortedUniqueIds(count);

            for (int i = 0; i < count; i++)
            {
                long id = uniqueIds[i];
                var message = new Value(id);
                list2.Add(id, message);
                list1.Add(message);
            }

            Verify(list2);
            AreEqual(list1, list2);

            for (int i = 0; i < count; i++)
            {
                int index = Rnd.Next(list1.Count - 1);
                Value item = list1[index];
                long id = item.Key;
                bool c = list2.Contains(id);
                Assert.True(c);

                list1.Remove(item);
                Value r = list2.Remove(id);
                c = list2.Contains(id);

                Assert.False(c);
                Assert.True(r != null);
                Assert.Equal(r, item);

                Verify(list2);
            }

            AreEqual(list1, list2);
            Verify(list2);
        }

        [Fact]
        public void RemoveTest_SortedDescItems()
        {
            const int count = 5000;
            var list1 = new List<Value>(2 * count);
            var list2 = new AvlTree<long, Value>();

            var uniqueIds = GetSortedUniqueIdsDesc(count);

            for (int i = 0; i < count; i++)
            {
                long id = uniqueIds[i];
                var message = new Value(id);
                list2.Add(id, message);
                list1.Add(message);
            }

            Verify(list2);
            AreEqual(list1, list2);

            for (int i = 0; i < count; i++)
            {
                int index = Rnd.Next(list1.Count - 1);
                Value item = list1[index];
                long id = item.Key;
                bool c = list2.Contains(id);
                Assert.True(c);

                list1.Remove(item);
                Value r = list2.Remove(id);
                c = list2.Contains(id);

                Assert.False(c);
                Assert.True(r != null);
                Assert.Equal(r, item);

                Verify(list2);
            }

            AreEqual(list1, list2);
            Verify(list2);
        }

        [Fact]
        public void ComplexTest()
        {
            const int count = 5000;
            var list1 = new List<Value>(2 * count);
            var list2 = new AvlTree<long, Value>();

            var uniqueIds = GetUniqueIds(count);

            for (int i = 0; i < count; i++)
            {
                long id = uniqueIds[i];
                var message = new Value(id);
                list2.Add(id, message);
                list1.Add(message);
            }

            Verify(list2);
            AreEqual(list1, list2);

            var deletedIds = new List<long>();

            for (int i = 0; i < count; i++)
            {
                bool delete = Rnd.Next(10000) > 5000;
                bool add = Rnd.Next(10000) > 7000;

                if ((delete) && (list1.Count > 0))
                {
                    int index = Rnd.Next(list1.Count - 1);
                    Value item = list1[index];
                    long id = item.Key;
                    bool c = list2.Contains(id);
                    Assert.True(c);

                    deletedIds.Add(id);

                    Value r = list2.Remove(id);
                    list1.Remove(item);

                    c = list2.Contains(id);

                    Assert.False(c);
                    Assert.True(r != null);
                    Assert.Equal(r, item);
                }
                if ((add) && (deletedIds.Count > 0))
                {
                    long id = deletedIds[0];
                    deletedIds.Remove(id);
                    bool c = list2.Contains(id);

                    var item = new Value(id);
                    list2.Add(id, item);
                    list1.Add(item);

                    Assert.False(c);
                }

                Verify(list2);
            }

            AreEqual(list1, list2);
            Verify(list2);
        }

        [Fact]
        public void ComplexTest_SortedItems()
        {
            const int count = 5000;
            var list1 = new List<Value>(2 * count);
            var list2 = new AvlTree<long, Value>();

            var uniqueIds = GetSortedUniqueIds(count);

            for (int i = 0; i < count; i++)
            {
                long id = uniqueIds[i];
                var message = new Value(id);
                list2.Add(id, message);
                list1.Add(message);
            }

            Verify(list2);
            AreEqual(list1, list2);

            var deletedIds = new List<long>();

            for (int i = 0; i < count; i++)
            {
                bool delete = Rnd.Next(10000) > 5000;
                bool add = Rnd.Next(10000) > 7000;

                if ((delete) && (list1.Count > 0))
                {
                    int index = Rnd.Next(list1.Count - 1);
                    Value item = list1[index];
                    long id = item.Key;
                    bool c = list2.Contains(id);
                    Assert.True(c);

                    deletedIds.Add(id);

                    Value r = list2.Remove(id);
                    list1.Remove(item);

                    c = list2.Contains(id);

                    Assert.False(c);
                    Assert.True(r != null);
                    Assert.Equal(r, item);
                }
                if ((add) && (deletedIds.Count > 0))
                {
                    long id = deletedIds[0];
                    deletedIds.Remove(id);
                    bool c = list2.Contains(id);

                    var item = new Value(id);
                    list2.Add(id, item);
                    list1.Add(item);

                    Assert.False(c);
                }

                Verify(list2);
            }

            AreEqual(list1, list2);
            Verify(list2);
        }

        [Fact]
        public void ComplexTest_SortedDescItems()
        {
            const int count = 1000;
            var list1 = new List<Value>(2 * count);
            var list2 = new AvlTree<long, Value>();

            var uniqueIds = GetSortedUniqueIdsDesc(count);

            for (int i = 0; i < count; i++)
            {
                long id = uniqueIds[i];
                var message = new Value(id);
                list2.Add(id, message);
                list1.Add(message);
            }

            Verify(list2);
            AreEqual(list1, list2);

            var deletedIds = new List<long>();

            for (int i = 0; i < count; i++)
            {
                bool delete = Rnd.Next(10000) > 5000;
                bool add = Rnd.Next(10000) > 7000;

                if ((delete) && (list1.Count > 0))
                {
                    int index = Rnd.Next(list1.Count - 1);
                    Value item = list1[index];
                    long id = item.Key;
                    bool c = list2.Contains(id);
                    Assert.True(c);

                    deletedIds.Add(id);

                    Value r = list2.Remove(id);
                    list1.Remove(item);

                    c = list2.Contains(id);

                    Assert.False(c);
                    Assert.True(r != null);
                    Assert.Equal(r, item);
                }
                if ((add) && (deletedIds.Count > 0))
                {
                    long id = deletedIds[0];
                    deletedIds.Remove(id);
                    bool c = list2.Contains(id);

                    var item = new Value(id);
                    list2.Add(id, item);
                    list1.Add(item);

                    Assert.False(c);
                }

                Verify(list2);
            }

            AreEqual(list1, list2);
            Verify(list2);
        }

        [Fact]
        public void SortAscTest()
        {
            var items = new int[10000];
            for (int i = 0; i < items.Length; i++)
            {
                items[i] = Rnd.Next(1000);
            }

            Sort(items);
            
            for (int i = 1; i < items.Length; i++)
            {
                Assert.True(items[i] >= items[i - 1]);
            }
        }
    }
}