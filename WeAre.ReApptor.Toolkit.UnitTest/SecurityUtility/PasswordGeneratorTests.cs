using System.Linq;
using Xunit;

namespace WeAre.ReApptor.Toolkit.UnitTest.SecurityUtility
{
    public class PasswordGeneratorTests
    {
        [Fact]
        public void GeneratePasswordTest()
        {
            const int count = 1000;
            string[] characters =
            {
                "abcdefghijklmnopqrstuvwxyz",
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                "0123456789",
                "!@#$%ˆ&*()_+-/|.,:;",
            };

            for (int i = 0; i < count; i++)
            {
                string password = SecureUtility.GeneratePassword(8, 12, characters);
            
                Assert.NotNull(password);
                Assert.True(password.Length >= 8);
                Assert.True(password.Length <= 12);

                for (int j = 0; j < characters.Length; j++)
                {
                    string set = characters[j];
                    bool contains = set.Any(item => password.Contains(item));
                    Assert.True(contains, $"Password \"{password}\" doesn't contain characters from set \"{set}\".");
                }
            }
        }

        [Fact]
        public void GenerateAesKeyTest()
        {
            string key = SecureUtility.GenerateAesKey();
            
            Assert.NotNull(key);
        }
    }
}