import nodemailer from 'nodemailer';

export interface InvitationMailer {
  sendInvitation(input: { to: string; candidateName: string; interviewId: string }): Promise<void>;
}

export class SmtpInvitationMailer implements InvitationMailer {
  private readonly transport;

  constructor(host: string, port: number) {
    this.transport = nodemailer.createTransport({ host, port, secure: false });
  }

  async sendInvitation(input: { to: string; candidateName: string; interviewId: string }): Promise<void> {
    await this.transport.sendMail({
      from: 'Talent Lab <noreply@talent.test>',
      to: input.to,
      subject: 'Interview invitation',
      text: `Hello ${input.candidateName}, your interview reference is ${input.interviewId}.`,
    });
  }
}

export class RecordingMailer implements InvitationMailer {
  readonly messages: Array<{ to: string; candidateName: string; interviewId: string }> = [];
  async sendInvitation(input: { to: string; candidateName: string; interviewId: string }): Promise<void> { this.messages.push(input); }
}
