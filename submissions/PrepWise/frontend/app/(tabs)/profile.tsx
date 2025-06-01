import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { resetProfile } from '@/store/slices/userSlice';
import { useRouter } from 'expo-router';
import { Calendar, Clock, BookOpen, Award, LogOut } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/hooks';

export default function ProfileScreen() {
  const user = useAppSelector((state) => state.user);
  const topics = useAppSelector((state) => state.learningPlan.topics);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleResetProfile = () => {
    dispatch(resetProfile());
    router.replace('/welcome');
  };

  const formatSubjects = (subjects: string[]) => {
    if (subjects.length <= 3) return subjects.join(', ');
    return `${subjects.slice(0, 2).join(', ')} and ${subjects.length - 2} more`;
  };


  const quizResults = topics.map((t) => t.quizResult).filter(Boolean);
  const quizzesAttempted = quizResults.length;
  const totalQuestions = quizResults.reduce((sum, result) => sum + result!.answers.length, 0);
  const correctAnswers = quizResults.reduce(
    (sum, result) => sum + result!.answers.filter((a) => a.selected === a.correct).length,
    0
  );
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const ProfileItem = ({
    icon,
    label,
    value,
  }: {
    icon: JSX.Element;
    label: string;
    value: string;
  }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileItemIcon}>{icon}</View>
      <View style={styles.profileItemContent}>
        <Text style={styles.profileItemLabel}>{label}</Text>
        <Text style={styles.profileItemValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userExam}>{user.exam} Aspirant</Text>
      </View>

      {/* Live Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{quizzesAttempted}</Text>
          <Text style={styles.statLabel}>Quizzes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{topics.length}</Text>
          <Text style={styles.statLabel}>Topics</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      {/* Study Profile */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Study Profile</Text>
        <View style={styles.profileInfoCard}>
          <ProfileItem icon={<BookOpen size={20} color="#7C3AED" />} label="Subjects" value={formatSubjects(user.subjects)} />
          <ProfileItem icon={<Award size={20} color="#7C3AED" />} label="Level" value={user.understandingLevel} />
          <ProfileItem icon={<Calendar size={20} color="#7C3AED" />} label="Target Year" value={user.targetYear} />
          <ProfileItem icon={<Clock size={20} color="#7C3AED" />} label="Daily Study Time" value={user.dailyStudyTime} />
        </View>
      </View>

      {/* Quiz Breakdown */}
      {quizResults.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quiz Scores</Text>
          <View style={styles.profileInfoCard}>
            {quizResults.map((result, index) => {
              const topic = topics.find((t) => t.quizResult === result);
              return (
                <View key={index} style={styles.quizScoreRow}>
                  <Text style={styles.quizTopic}>{topic?.title}</Text>
                  <Text style={styles.quizScore}>{result.scorePercentage}%</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleResetProfile}>
          <LogOut size={20} color="#EF4444" />
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Reset Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Session ID: {user.sessionId}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  contentContainer: { padding: 16, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24, marginTop: 12 },
  avatarContainer: { marginBottom: 12 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 36, fontWeight: '600', color: '#FFFFFF' },
  userName: { fontSize: 22, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  userExam: { fontSize: 16, color: '#64748B' },

  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#64748B' },
  statDivider: { width: 1, backgroundColor: '#E2E8F0' },

  sectionContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#334155', marginBottom: 12 },

  profileInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileItemContent: { flex: 1 },
  profileItemLabel: { fontSize: 14, color: '#64748B', marginBottom: 2 },
  profileItemValue: { fontSize: 16, fontWeight: '500', color: '#334155' },

  quizScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  quizTopic: { fontSize: 15, color: '#334155', flex: 1 },
  quizScore: { fontSize: 15, fontWeight: '600', color: '#7C3AED' },

  actionsContainer: { marginBottom: 24 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: { marginLeft: 12, fontSize: 16, fontWeight: '500', color: '#475569' },
  logoutButton: { borderWidth: 1, borderColor: '#FEE2E2', backgroundColor: '#FEF2F2' },
  logoutButtonText: { color: '#EF4444' },

  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 12, color: '#94A3B8' },
});
