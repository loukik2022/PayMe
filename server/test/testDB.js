import mongoose, { Collection } from 'mongoose';
import { User } from '../models/user.js';
import { Transaction } from '../models/transaction.js';
import { Subscription } from '../models/subscription.js';

// Test all mongo db schema

// MongoDB connection
const uri = 'mongodb://localhost:27017/PayMe';

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

const db = mongoose.connection;

db.once('open', async () => {
  try {
    /** ------------------- User Schema Test ------------------- **/
    console.log('Testing User Schema...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword',
    });
    const savedUser = await testUser.save();
    console.log('User saved:', savedUser);

    const retrievedUser = await User.findOne({ email: 'test@example.com' });
    console.log('Retrieved User:', retrievedUser);

    
    /** ---------------- Subscription Schema Test ---------------- **/
    console.log('\nTesting Subscription Schema...');
    const testSubscription = new Subscription({
        userId: savedUser._id, // Reference to the created user
        planName: 'Pro Plan',
        price: 29.99,
        billingCycle: 'monthly',
        startDate: new Date(),
    });
    const savedSubscription = await testSubscription.save();
    console.log('Subscription saved:', savedSubscription);
    
    const retrievedSubscription = await Subscription.findOne({ planName: 'Pro Plan' });
    console.log('Retrieved Subscription:', retrievedSubscription);
    
    /** ---------------- Transaction Schema Test ---------------- **/
    console.log('\nTesting Transaction Schema...');
    const testTransaction = new Transaction({
      userId: savedUser._id, // Reference to the created user
      subscriptionId: savedSubscription._id, // Reference to the subscription
      amount: 100.5,
      currency: 'USD',
      status: 'success',
      paymentMethod: 'credit_card',
    });
    const savedTransaction = await testTransaction.save();
    console.log('Transaction saved:', savedTransaction);

    const retrievedTransaction = await Transaction.findOne({ status: 'success' });
    console.log('Retrieved Transaction:', retrievedTransaction);

    /** ----------------- Cleanup Test Data ----------------- **/
    console.log('\nCleaning up test data...');
    await User.deleteOne({ _id: savedUser._id });
    await Transaction.deleteOne({ _id: savedTransaction._id });
    await Subscription.deleteOne({ _id: savedSubscription._id });

    console.log('Test data deleted successfully.');

    // Close the database connection
    mongoose.disconnect();
    console.log('\n=== All Tests Completed Successfully ===\n');
  } catch (error) {
    console.error('Error during testing:', error);
    mongoose.disconnect();
  }
});


// db.<Collection_name>.deleteMany()